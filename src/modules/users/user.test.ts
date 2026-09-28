import { describe, expect, it } from 'vitest';

import { ApiError } from '../../errors/ApiError.js';
import { hashPassword, verifyPassword } from './password.js';
import { validateCreateUser, validateUpdateUser } from './user.validation.js';

describe('usuarios y roles', () => {
  it('normaliza y valida un usuario nuevo', () => {
    expect(
      validateCreateUser({
        name: '  Ana Mora ',
        email: ' ANA@SICAF.CR ',
        password: 'Clave123',
        role: 'ADMINISTRADOR',
      }),
    ).toEqual({ name: 'Ana Mora', email: 'ana@sicaf.cr', password: 'Clave123', role: 'ADMINISTRADOR' });
  });

  it('rechaza contraseñas débiles y roles desconocidos', () => {
    expect(() =>
      validateCreateUser({ name: 'Ana', email: 'ana@sicaf.cr', password: 'clave', role: 'OTRO' }),
    ).toThrow(ApiError);
  });

  it('permite activar o desactivar un usuario', () => {
    expect(validateUpdateUser({ active: false })).toEqual({ active: false });
  });

  it('protege y verifica contraseñas sin almacenarlas en texto plano', async () => {
    const hash = await hashPassword('Clave123');
    expect(hash).not.toContain('Clave123');
    await expect(verifyPassword('Clave123', hash)).resolves.toBe(true);
    await expect(verifyPassword('Incorrecta123', hash)).resolves.toBe(false);
  });
});
