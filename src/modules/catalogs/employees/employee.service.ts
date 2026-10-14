import { Op, UniqueConstraintError, type WhereOptions } from 'sequelize';

import { ApiError } from '../../../errors/ApiError.js';
import { getEmployeeModel, type Employee } from './employee.model.js';
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employee.types.js';
import { requireActiveDepartment } from '../departments/department.service.js';

export async function listEmployees(search?: string) {
  const query = search?.trim();
  const where: WhereOptions<Employee> | undefined = query
    ? {
        [Op.or]: [
          { identification: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } },
          { department: { [Op.iLike]: `%${query}%` } },
        ],
      }
    : undefined;
  return getEmployeeModel().findAll({ where, order: [['name', 'ASC']] });
}

export async function createEmployee(input: CreateEmployeeInput) {
  await requireActiveDepartment(input.department);
  try {
    return await getEmployeeModel().create(input);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ApiError(409, 'Ya existe un funcionario con esa identificación');
    }
    throw error;
  }
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput) {
  const employee = await getEmployeeModel().findByPk(id);
  if (!employee) throw new ApiError(404, 'Funcionario no encontrado');
  if (input.department !== undefined && input.department !== employee.department) {
    await requireActiveDepartment(input.department);
  }
  try {
    await employee.update(input);
    return employee;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ApiError(409, 'Ya existe un funcionario con esa identificación');
    }
    throw error;
  }
}
