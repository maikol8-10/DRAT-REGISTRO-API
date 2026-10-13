import { describe, expect, it } from 'vitest';

import { normalizeNfcCode, validateCreateNfcTag, validateUpdateNfcTag } from './nfcTag.validation.js';

const employeeId = '123e4567-e89b-42d3-a456-426614174000';

describe('catálogo de TAG NFC', () => {
  it('normaliza el código antes de buscarlo', () => {
    expect(normalizeNfcCode(' tag-andres-01 ')).toBe('TAG-ANDRES-01');
  });

  it('valida la asociación con un funcionario', () => {
    expect(validateCreateNfcTag({ code: 'tag-001', employeeId })).toEqual({ code: 'TAG-001', employeeId });
  });

  it('impide modificar el código del TAG', () => {
    expect(() => validateUpdateNfcTag({ code: 'TAG-002' })).toThrow('El código del TAG NFC no se puede modificar');
  });
});
