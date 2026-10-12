import { describe, expect, it } from 'vitest';

import { ApiError } from '../../../errors/ApiError.js';
import { validateCreateEmployee, validateUpdateEmployee } from './employee.validation.js';

describe('catálogo de funcionarios', () => {
  it('normaliza los datos de un funcionario', () => {
    expect(validateCreateEmployee({
      identification: ' 1-2345-6789 ',
      name: '  Ana   Mora ',
      department: ' Dirección Regional ',
      position: ' Profesional ',
    })).toEqual({
      identification: '123456789',
      name: 'Ana Mora',
      department: 'Dirección Regional',
      position: 'Profesional',
    });
  });

  it('rechaza una identificación inválida', () => {
    expect(() => validateCreateEmployee({
      identification: '12!', name: 'Ana Mora', department: 'DRAT', position: 'Profesional',
    })).toThrow(ApiError);
  });

  it('permite desactivar un funcionario', () => {
    expect(validateUpdateEmployee({ active: false })).toEqual({ active: false });
  });

  it('impide modificar la identificación', () => {
    expect(() => validateUpdateEmployee({ identification: '987654321' })).toThrow(
      'La identificación del funcionario no se puede modificar',
    );
  });
});
