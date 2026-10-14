import { describe, expect, it } from 'vitest';
import { validateHistoryFilters } from './movementHistory.service.js';

describe('filtros del historial de movimientos', () => {
  it('acepta fechas, tipo y estado válidos', () => {
    const result = validateHistoryFilters({ from: '2026-10-01', to: '2026-10-14', type: 'FUNCIONARIO', state: 'INGRESO' });
    expect(result.type).toBe('FUNCIONARIO');
    expect(result.state).toBe('INGRESO');
  });
  it('rechaza rangos invertidos', () => expect(() => validateHistoryFilters({ from: '2026-10-14', to: '2026-10-01' })).toThrow('fecha inicial'));
  it('rechaza tipos desconocidos', () => expect(() => validateHistoryFilters({ type: 'OTRO' })).toThrow('Tipo de movimiento inválido'));
});
