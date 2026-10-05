import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { ApiError } from '../../errors/ApiError.js';
import { verifyPassword } from '../users/password.js';
import { getUserModel } from '../users/user.model.js';
import type { UserRole } from '../users/user.types.js';

type LoginResponse = {
  token: string;
  user: { id: string; name: string; email: string; role: UserRole };
};

export async function login(input: { email: string; password: string }): Promise<LoginResponse> {
  if (!env.jwtSecret) {
    throw new ApiError(503, 'La autenticación no está configurada');
  }

  const user = await getUserModel().findOne({ where: { email: input.email } });
  if (!user || !user.active || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new ApiError(401, 'Correo o contraseña incorrectos');
  }

  const token = jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    env.jwtSecret,
    { algorithm: 'HS256', expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] },
  );

  return {
    token,
    user: { id: String(user.id), name: user.name, email: user.email, role: user.role },
  };
}
