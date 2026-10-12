import { ApiError } from '../../../errors/ApiError.js';
import { fuelTypes, type CreateInstitutionalVehicleInput, type FuelType, type UpdateInstitutionalVehicleInput } from './institutionalVehicle.types.js';

function text(value: unknown, field: string, minimum: number, maximum: number) {
  if (typeof value !== 'string') throw new ApiError(400, 'Datos del vehículo inválidos', { [field]: 'Es requerido' });
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new ApiError(400, 'Datos del vehículo inválidos', { [field]: `Debe contener entre ${minimum} y ${maximum} caracteres` });
  }
  return normalized;
}

function plate(value: unknown) {
  const normalized = text(value, 'plate', 3, 15).replace(/[\s-]/g, '').toUpperCase();
  if (!/^[A-Z0-9]+$/.test(normalized)) {
    throw new ApiError(400, 'Datos del vehículo inválidos', { plate: 'Solo puede contener letras, números, espacios o guiones' });
  }
  return normalized;
}

function year(value: unknown) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1900 || value > 2100) {
    throw new ApiError(400, 'Datos del vehículo inválidos', { year: 'Debe ser un año válido entre 1900 y 2100' });
  }
  return value;
}

function fuelType(value: unknown): FuelType {
  if (typeof value !== 'string' || !fuelTypes.includes(value as FuelType)) {
    throw new ApiError(400, 'Datos del vehículo inválidos', { fuelType: 'Tipo de combustible inválido' });
  }
  return value as FuelType;
}

export function validateCreateInstitutionalVehicle(body: unknown): CreateInstitutionalVehicleInput {
  const value = body as Record<string, unknown>;
  return {
    plate: plate(value.plate),
    assetCode: text(value.assetCode, 'assetCode', 2, 40).toUpperCase(),
    brand: text(value.brand, 'brand', 2, 80),
    model: text(value.model, 'model', 1, 80),
    year: year(value.year),
    fuelType: fuelType(value.fuelType),
  };
}

export function validateUpdateInstitutionalVehicle(body: unknown): UpdateInstitutionalVehicleInput {
  const value = body as Record<string, unknown>;
  const result: UpdateInstitutionalVehicleInput = {};
  if ('plate' in value) throw new ApiError(400, 'La placa del vehículo no se puede modificar');
  if ('assetCode' in value) result.assetCode = text(value.assetCode, 'assetCode', 2, 40).toUpperCase();
  if ('brand' in value) result.brand = text(value.brand, 'brand', 2, 80);
  if ('model' in value) result.model = text(value.model, 'model', 1, 80);
  if ('year' in value) result.year = year(value.year);
  if ('fuelType' in value) result.fuelType = fuelType(value.fuelType);
  if ('active' in value) {
    if (typeof value.active !== 'boolean') throw new ApiError(400, 'Datos del vehículo inválidos', { active: 'Debe ser verdadero o falso' });
    result.active = value.active;
  }
  if (Object.keys(result).length === 0) throw new ApiError(400, 'Debe indicar al menos un campo para actualizar');
  return result;
}
