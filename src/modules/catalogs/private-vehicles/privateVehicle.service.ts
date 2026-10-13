import { Op, QueryTypes, UniqueConstraintError, type Transaction, type WhereOptions } from 'sequelize';

import { requireDatabase } from '../../../config/database.js';
import { ApiError } from '../../../errors/ApiError.js';
import { getEmployeeModel } from '../employees/employee.model.js';
import { getPrivateVehicleModel, type PrivateVehicle } from './privateVehicle.model.js';
import type { CreatePrivateVehicleInput, UpdatePrivateVehicleInput } from './privateVehicle.types.js';

async function requireActiveOwner(id: string) {
  const employee = await getEmployeeModel().findByPk(id);
  if (!employee) throw new ApiError(404, 'Funcionario propietario no encontrado');
  if (!employee.active) throw new ApiError(409, 'No se puede asociar el vehículo porque el funcionario está inactivo');
  return employee;
}

async function withOwner(vehicle: PrivateVehicle) {
  const owner = await getEmployeeModel().findByPk(vehicle.ownerEmployeeId, { attributes: ['id', 'identification', 'name', 'department', 'active'] });
  return { ...vehicle.toJSON(), owner };
}

export async function listPrivateVehicles(search?: string) {
  const query = search?.trim();
  const matchingOwnerIds = query
    ? (await getEmployeeModel().findAll({
        attributes: ['id'],
        where: { [Op.or]: [{ identification: { [Op.iLike]: `%${query}%` } }, { name: { [Op.iLike]: `%${query}%` } }] },
      })).map((employee) => employee.id)
    : [];
  const where: WhereOptions<PrivateVehicle> | undefined = query
    ? { [Op.or]: [
        { plate: { [Op.iLike]: `%${query}%` } }, { brand: { [Op.iLike]: `%${query}%` } },
        { model: { [Op.iLike]: `%${query}%` } }, { ownerEmployeeId: { [Op.in]: matchingOwnerIds } },
      ] }
    : undefined;
  const vehicles = await getPrivateVehicleModel().findAll({ where, order: [['plate', 'ASC']] });
  return Promise.all(vehicles.map(withOwner));
}

async function recordOwner(vehicleId: string, employeeId: string, transaction: Transaction) {
  await requireDatabase().query(
    'INSERT INTO private_vehicle_owner_history (vehicle_id, employee_id) VALUES (:vehicleId, :employeeId)',
    { replacements: { vehicleId, employeeId }, type: QueryTypes.INSERT, transaction },
  );
}

export async function createPrivateVehicle(input: CreatePrivateVehicleInput) {
  await requireActiveOwner(input.ownerEmployeeId);
  const transaction = await requireDatabase().transaction();
  try {
    const vehicle = await getPrivateVehicleModel().create(input, { transaction });
    await recordOwner(vehicle.id, input.ownerEmployeeId, transaction);
    await transaction.commit();
    return withOwner(vehicle);
  } catch (error) {
    await transaction.rollback();
    if (error instanceof UniqueConstraintError) throw new ApiError(409, 'Ya existe un vehículo particular con esa placa');
    throw error;
  }
}

export async function updatePrivateVehicle(id: string, input: UpdatePrivateVehicleInput) {
  const vehicle = await getPrivateVehicleModel().findByPk(id);
  if (!vehicle) throw new ApiError(404, 'Vehículo particular no encontrado');
  const ownerChanged = input.ownerEmployeeId !== undefined && input.ownerEmployeeId !== vehicle.ownerEmployeeId;
  const resultingOwnerId = input.ownerEmployeeId ?? vehicle.ownerEmployeeId;
  if (ownerChanged || input.active === true) await requireActiveOwner(resultingOwnerId);
  const transaction = await requireDatabase().transaction();
  try {
    if (ownerChanged) {
      await requireDatabase().query(
        'UPDATE private_vehicle_owner_history SET valid_until = NOW() WHERE vehicle_id = :vehicleId AND valid_until IS NULL',
        { replacements: { vehicleId: id }, type: QueryTypes.UPDATE, transaction },
      );
      await recordOwner(id, resultingOwnerId, transaction);
    }
    await vehicle.update(input, { transaction });
    await transaction.commit();
    return withOwner(vehicle);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
