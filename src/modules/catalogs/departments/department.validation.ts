import { ApiError } from '../../../errors/ApiError.js';

export function validateCreateDepartment(body: unknown) {
  if (!body || typeof body !== 'object') throw new ApiError(400, 'Datos del departamento inválidos');
  const name = typeof (body as { name?: unknown }).name === 'string' ? (body as { name: string }).name.trim().replace(/\s+/g, ' ') : '';
  if (name.length < 2 || name.length > 120) throw new ApiError(400, 'El nombre del departamento debe tener entre 2 y 120 caracteres');
  return { name };
}

export function validateUpdateDepartment(body: unknown) {
  if (!body || typeof body !== 'object') throw new ApiError(400, 'Datos del departamento inválidos');
  const value = body as { name?: unknown; active?: unknown };
  const result: { name?: string; active?: boolean } = {};
  if ('name' in value) result.name = validateCreateDepartment({ name: value.name }).name;
  if ('active' in value) {
    if (typeof value.active !== 'boolean') throw new ApiError(400, 'El estado del departamento debe ser verdadero o falso');
    result.active = value.active;
  }
  if (result.name === undefined && result.active === undefined) throw new ApiError(400, 'No se indicaron cambios para el departamento');
  return result;
}
