import { UniqueConstraintError } from 'sequelize';

import { ApiError } from '../../../errors/ApiError.js';
import { getEmployeeModel } from '../employees/employee.model.js';
import { getNfcTagModel, type NfcTag } from './nfcTag.model.js';

async function requireActiveEmployee(id: string) {
  const employee = await getEmployeeModel().findByPk(id);
  if (!employee) throw new ApiError(404, 'Funcionario no encontrado');
  if (!employee.active) throw new ApiError(409, 'No se puede asociar el TAG porque el funcionario está inactivo');
  return employee;
}

async function withEmployee(tag: NfcTag) {
  const employee = await getEmployeeModel().findByPk(tag.employeeId, { attributes: ['id', 'identification', 'name', 'department', 'position', 'active'] });
  return { ...tag.toJSON(), employee };
}

export async function listNfcTags() {
  const tags = await getNfcTagModel().findAll({ order: [['createdAt', 'DESC']] });
  return Promise.all(tags.map(withEmployee));
}

export async function createNfcTag(input: { code: string; employeeId: string }) {
  await requireActiveEmployee(input.employeeId);
  try { return withEmployee(await getNfcTagModel().create(input)); }
  catch (error) {
    if (error instanceof UniqueConstraintError) throw new ApiError(409, 'El TAG está duplicado o el funcionario ya tiene un TAG asociado');
    throw error;
  }
}

export async function updateNfcTag(id: string, input: { employeeId?: string; active?: boolean }) {
  const tag = await getNfcTagModel().findByPk(id);
  if (!tag) throw new ApiError(404, 'TAG NFC no encontrado');
  const employeeId = input.employeeId ?? tag.employeeId;
  if (input.employeeId || input.active === true) await requireActiveEmployee(employeeId);
  try { await tag.update(input); return withEmployee(tag); }
  catch (error) {
    if (error instanceof UniqueConstraintError) throw new ApiError(409, 'El funcionario ya tiene un TAG asociado');
    throw error;
  }
}
