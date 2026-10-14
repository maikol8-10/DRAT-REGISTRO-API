import { describe, expect, it } from 'vitest';
import { validateContingencyReason } from './movementContingency.service.js';

describe('contingencias de movimientos', () => {
  it('exige un motivo suficientemente descriptivo', () => expect(() => validateContingencyReason('corto')).toThrow('entre 10 y 500'));
  it('normaliza un motivo válido', () => expect(validateContingencyReason('  Omisión confirmada por supervisión  ')).toBe('Omisión confirmada por supervisión'));
});
