import { describe, expect, it } from 'vitest';

import { normalizeMovementPlate } from './privateVehicleMovement.service.js';

describe('movimientos de vehículos particulares', () => {
  it('normaliza una placa escrita manualmente', () => {
    expect(normalizeMovementPlate(' abc-123 ')).toBe('ABC123');
  });

  it('rechaza placas inválidas', () => {
    expect(() => normalizeMovementPlate('A!')).toThrow('Placa inválida');
  });
});
