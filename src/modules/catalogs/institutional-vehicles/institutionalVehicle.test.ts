import { describe, expect, it } from 'vitest';

import { ApiError } from '../../../errors/ApiError.js';
import { validateCreateInstitutionalVehicle, validateUpdateInstitutionalVehicle } from './institutionalVehicle.validation.js';

describe('catálogo de vehículos institucionales', () => {
  it('normaliza los datos y conserva el tipo institucional', () => {
    expect(validateCreateInstitutionalVehicle({
      plate: ' sm-12 34 ', assetCode: ' veh-001 ', brand: ' Toyota ', model: ' Hilux ', year: 2024, fuelType: 'DIESEL',
    })).toEqual({ plate: 'SM1234', assetCode: 'VEH-001', brand: 'Toyota', model: 'Hilux', year: 2024, fuelType: 'DIESEL' });
  });

  it('rechaza una placa inválida', () => {
    expect(() => validateCreateInstitutionalVehicle({
      plate: 'A!', assetCode: 'VEH-001', brand: 'Toyota', model: 'Hilux', year: 2024, fuelType: 'DIESEL',
    })).toThrow(ApiError);
  });

  it('permite desactivar un vehículo', () => {
    expect(validateUpdateInstitutionalVehicle({ active: false })).toEqual({ active: false });
  });

  it('impide modificar la placa', () => {
    expect(() => validateUpdateInstitutionalVehicle({ plate: 'ABC123' })).toThrow('La placa del vehículo no se puede modificar');
  });
});
