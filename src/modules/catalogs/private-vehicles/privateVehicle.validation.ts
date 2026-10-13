import { ApiError } from '../../../errors/ApiError.js';
import type { CreatePrivateVehicleInput, UpdatePrivateVehicleInput } from './privateVehicle.types.js';

function text(value: unknown, field: string, minimum: number, maximum: number) {
  if (typeof value !== 'string') throw new ApiError(400, 'Datos del vehículo particular inválidos', { [field]: 'Es requerido' });
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new ApiError(400, 'Datos del vehículo particular inválidos', { [field]: `Debe contener entre ${minimum} y ${maximum} caracteres` });
  }
  return normalized;
}

function plate(value: unknown) {
  const normalized = text(value, 'plate', 3, 15).replace(/[\s-]/g, '').toUpperCase();
  if (!/^[A-Z0-9]+$/.test(normalized)) throw new ApiError(400, 'Datos del vehículo particular inválidos', { plate: 'Placa inválida' });
  return normalized;
}

function employeeId(value: unknown) {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new ApiError(400, 'Datos del vehículo particular inválidos', { ownerEmployeeId: 'Funcionario inválido' });
  }
  return value;
}

export function validateCreatePrivateVehicle(body: unknown): CreatePrivateVehicleInput {
  const value = body as Record<string, unknown>;
  return {
    plate: plate(value.plate),
    brand: text(value.brand, 'brand', 2, 80),
    model: text(value.model, 'model', 1, 80),
    color: text(value.color, 'color', 2, 50),
    ownerEmployeeId: employeeId(value.ownerEmployeeId),
  };
}

export function validateUpdatePrivateVehicle(body: unknown): UpdatePrivateVehicleInput {
  const value = body as Record<string, unknown>;
  const result: UpdatePrivateVehicleInput = {};
  if ('plate' in value) throw new ApiError(400, 'La placa del vehículo no se puede modificar');
  if ('brand' in value) result.brand = text(value.brand, 'brand', 2, 80);
  if ('model' in value) result.model = text(value.model, 'model', 1, 80);
  if ('color' in value) result.color = text(value.color, 'color', 2, 50);
  if ('ownerEmployeeId' in value) result.ownerEmployeeId = employeeId(value.ownerEmployeeId);
  if ('active' in value) {
    if (typeof value.active !== 'boolean') throw new ApiError(400, 'Datos del vehículo particular inválidos', { active: 'Debe ser verdadero o falso' });
    result.active = value.active;
  }
  if (Object.keys(result).length === 0) throw new ApiError(400, 'Debe indicar al menos un campo para actualizar');
  return result;
}
