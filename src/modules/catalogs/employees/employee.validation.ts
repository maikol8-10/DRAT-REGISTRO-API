import { ApiError } from '../../../errors/ApiError.js';
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employee.types.js';

function text(value: unknown, field: string, minimum = 2, maximum = 160) {
  if (typeof value !== 'string') {
    throw new ApiError(400, 'Datos del funcionario inválidos', { [field]: 'Es requerido' });
  }
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new ApiError(400, 'Datos del funcionario inválidos', {
      [field]: `Debe contener entre ${minimum} y ${maximum} caracteres`,
    });
  }
  return normalized;
}

function identification(value: unknown) {
  const normalized = text(value, 'identification', 5, 20).replace(/[\s-]/g, '');
  if (!/^[A-Za-z0-9]+$/.test(normalized)) {
    throw new ApiError(400, 'Datos del funcionario inválidos', {
      identification: 'Solo puede contener letras y números',
    });
  }
  return normalized.toUpperCase();
}

export function validateCreateEmployee(body: unknown): CreateEmployeeInput {
  const value = body as Record<string, unknown>;
  return {
    identification: identification(value.identification),
    name: text(value.name, 'name'),
    department: text(value.department, 'department', 2, 120),
    position: text(value.position, 'position', 2, 120),
  };
}

export function validateUpdateEmployee(body: unknown): UpdateEmployeeInput {
  const value = body as Record<string, unknown>;
  const result: UpdateEmployeeInput = {};
  if ('identification' in value) {
    throw new ApiError(400, 'La identificación del funcionario no se puede modificar');
  }
  if ('name' in value) result.name = text(value.name, 'name');
  if ('department' in value) result.department = text(value.department, 'department', 2, 120);
  if ('position' in value) result.position = text(value.position, 'position', 2, 120);
  if ('active' in value) {
    if (typeof value.active !== 'boolean') {
      throw new ApiError(400, 'Datos del funcionario inválidos', { active: 'Debe ser verdadero o falso' });
    }
    result.active = value.active;
  }
  if (Object.keys(result).length === 0) {
    throw new ApiError(400, 'Debe indicar al menos un campo para actualizar');
  }
  return result;
}
