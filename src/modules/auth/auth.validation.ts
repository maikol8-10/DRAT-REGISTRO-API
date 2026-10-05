import { ApiError } from '../../errors/ApiError.js';

export type LoginInput = { email: string; password: string };

export function validateLogin(body: unknown): LoginInput {
  const value = body as Record<string, unknown>;
  if (typeof value.email !== 'string' || typeof value.password !== 'string') {
    throw new ApiError(400, 'Correo y contraseña son requeridos');
  }

  const email = value.email.trim().toLowerCase();
  if (!email || !value.password) {
    throw new ApiError(400, 'Correo y contraseña son requeridos');
  }

  return { email, password: value.password };
}
