import { describe, expect, it } from 'vitest';

import { validateCreatePrivateVehicle, validateUpdatePrivateVehicle } from './privateVehicle.validation.js';

const employeeId = '123e4567-e89b-42d3-a456-426614174000';

describe('vehículos particulares asociados a funcionarios', () => {
  it('normaliza una placa y conserva el propietario', () => {
    expect(validateCreatePrivateVehicle({ plate: ' abc-123 ', brand: ' Toyota ', model: 'Yaris', color: 'Gris', ownerEmployeeId: employeeId }))
      .toEqual({ plate: 'ABC123', brand: 'Toyota', model: 'Yaris', color: 'Gris', ownerEmployeeId: employeeId });
  });

  it('permite cambiar el propietario habitual', () => {
    expect(validateUpdatePrivateVehicle({ ownerEmployeeId: employeeId })).toEqual({ ownerEmployeeId: employeeId });
  });

  it('impide modificar la placa', () => {
    expect(() => validateUpdatePrivateVehicle({ plate: 'DEF456' })).toThrow('La placa del vehículo no se puede modificar');
  });
});
