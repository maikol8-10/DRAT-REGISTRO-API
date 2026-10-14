import { describe, expect, it } from 'vitest';

import { validateCreateDepartment, validateUpdateDepartment } from './department.validation.js';

describe('catálogo de departamentos', () => {
  it('normaliza el nombre', () => {
    expect(validateCreateDepartment({ name: '  Dirección   Regional ' })).toEqual({ name: 'Dirección Regional' });
  });

  it('valida el estado', () => {
    expect(validateUpdateDepartment({ active: false })).toEqual({ active: false });
    expect(() => validateUpdateDepartment({ active: 'no' })).toThrow();
  });

  it('permite renombrar y rechaza actualizaciones vacías', () => {
    expect(validateUpdateDepartment({ name: '  Gestión   Técnica ' })).toEqual({ name: 'Gestión Técnica' });
    expect(() => validateUpdateDepartment({})).toThrow();
  });
});
