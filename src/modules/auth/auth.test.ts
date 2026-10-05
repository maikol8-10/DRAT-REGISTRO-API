import { describe, expect, it } from 'vitest';

import { ApiError } from '../../errors/ApiError.js';
import { validateLogin } from './auth.validation.js';

describe('autenticación', () => {
  it('normaliza las credenciales', () => {
    expect(validateLogin({ email: ' ADMIN@SICAF.LOCAL ', password: 'Clave123' })).toEqual({
      email: 'admin@sicaf.local',
      password: 'Clave123',
    });
  });

  it('requiere correo y contraseña', () => {
    expect(() => validateLogin({ email: '' })).toThrow(ApiError);
  });
});
