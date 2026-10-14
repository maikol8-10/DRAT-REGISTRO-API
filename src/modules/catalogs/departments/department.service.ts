import { UniqueConstraintError } from 'sequelize';

import { ApiError } from '../../../errors/ApiError.js';
import { requireDatabase } from '../../../config/database.js';
import { getEmployeeModel } from '../employees/employee.model.js';
import { getDepartmentModel } from './department.model.js';

export function listDepartments() {
  return getDepartmentModel().findAll({ order: [['name', 'ASC']] });
}

export async function createDepartment(input: { name: string }) {
  try {
    return await getDepartmentModel().create(input);
  } catch (error) {
    if (error instanceof UniqueConstraintError) throw new ApiError(409, 'Ya existe un departamento con ese nombre');
    throw error;
  }
}

export async function updateDepartment(id: string, input: { name?: string; active?: boolean }) {
  return requireDatabase().transaction(async (transaction) => {
    const department = await getDepartmentModel().findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!department) throw new ApiError(404, 'Departamento no encontrado');
    const previousName = department.name;
    try {
      await department.update(input, { transaction });
      if (input.name !== undefined && input.name !== previousName) {
        await getEmployeeModel().update({ department: input.name }, { where: { department: previousName }, transaction });
      }
      return department;
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw new ApiError(409, 'Ya existe un departamento con ese nombre');
      throw error;
    }
  });
}

export async function deleteDepartment(id: string) {
  const department = await getDepartmentModel().findByPk(id);
  if (!department) throw new ApiError(404, 'Departamento no encontrado');
  const assignedEmployees = await getEmployeeModel().count({ where: { department: department.name } });
  if (assignedEmployees > 0) {
    throw new ApiError(409, `No se puede eliminar el departamento porque tiene ${assignedEmployees} funcionario(s) asignado(s)`);
  }
  await department.destroy();
}

export async function requireActiveDepartment(name: string) {
  const department = await getDepartmentModel().findOne({ where: { name, active: true } });
  if (!department) throw new ApiError(409, 'Debe seleccionar un departamento activo del catálogo');
  return department;
}
