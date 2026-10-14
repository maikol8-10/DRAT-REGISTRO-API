import { UniqueConstraintError } from 'sequelize';

import { ApiError } from '../../../errors/ApiError.js';
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

export async function updateDepartment(id: string, input: { active: boolean }) {
  const department = await getDepartmentModel().findByPk(id);
  if (!department) throw new ApiError(404, 'Departamento no encontrado');
  await department.update(input);
  return department;
}

export async function requireActiveDepartment(name: string) {
  const department = await getDepartmentModel().findOne({ where: { name, active: true } });
  if (!department) throw new ApiError(409, 'Debe seleccionar un departamento activo del catálogo');
  return department;
}
