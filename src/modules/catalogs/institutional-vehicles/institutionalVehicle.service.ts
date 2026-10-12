import { Op, UniqueConstraintError, type WhereOptions } from 'sequelize';

import { ApiError } from '../../../errors/ApiError.js';
import { getInstitutionalVehicleModel, type InstitutionalVehicle } from './institutionalVehicle.model.js';
import type { CreateInstitutionalVehicleInput, UpdateInstitutionalVehicleInput } from './institutionalVehicle.types.js';

export async function listInstitutionalVehicles(search?: string) {
  const query = search?.trim();
  const where: WhereOptions<InstitutionalVehicle> | undefined = query
    ? { [Op.or]: [
        { plate: { [Op.iLike]: `%${query}%` } },
        { assetCode: { [Op.iLike]: `%${query}%` } },
        { brand: { [Op.iLike]: `%${query}%` } },
        { model: { [Op.iLike]: `%${query}%` } },
      ] }
    : undefined;
  return getInstitutionalVehicleModel().findAll({ where, order: [['plate', 'ASC']] });
}

export async function createInstitutionalVehicle(input: CreateInstitutionalVehicleInput) {
  try {
    return await getInstitutionalVehicleModel().create(input);
  } catch (error) {
    if (error instanceof UniqueConstraintError) throw new ApiError(409, 'Ya existe un vehículo con esa placa o código patrimonial');
    throw error;
  }
}

export async function updateInstitutionalVehicle(id: string, input: UpdateInstitutionalVehicleInput) {
  const vehicle = await getInstitutionalVehicleModel().findByPk(id);
  if (!vehicle) throw new ApiError(404, 'Vehículo institucional no encontrado');
  try {
    await vehicle.update(input);
    return vehicle;
  } catch (error) {
    if (error instanceof UniqueConstraintError) throw new ApiError(409, 'Ya existe un vehículo con ese código patrimonial');
    throw error;
  }
}
