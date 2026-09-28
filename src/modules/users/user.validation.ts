import { ApiError } from '../../errors/ApiError.js';
import { USER_ROLES, type CreateUserInput, type UpdateUserInput, type UserRole } from './user.types.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredText(value: unknown, field: string, minimum = 2) {
  if (typeof value !== 'string' || value.trim().length < minimum) {
    throw new ApiError(400, 'Datos de usuario inválidos', {
      [field]: `Debe contener al menos ${minimum} caracteres`,
    });
  }
  return value.trim();
}

function email(value: unknown) {
  const normalized = requiredText(value, 'email').toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    throw new ApiError(400, 'Datos de usuario inválidos', { email: 'Formato de correo inválido' });
  }
  return normalized;
}

function password(value: unknown) {
  const valid =
    typeof value === 'string' &&
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value);
  if (!valid) {
    throw new ApiError(400, 'Datos de usuario inválidos', {
      password: 'Debe tener 8 caracteres e incluir mayúscula, minúscula y número',
    });
  }
  return value;
}

function role(value: unknown): UserRole {
  if (typeof value !== 'string' || !USER_ROLES.includes(value as UserRole)) {
    throw new ApiError(400, 'Datos de usuario inválidos', {
      role: `Debe ser uno de: ${USER_ROLES.join(', ')}`,
    });
  }
  return value as UserRole;
}

export function validateCreateUser(body: unknown): CreateUserInput {
  const value = body as Record<string, unknown>;
  return {
    name: requiredText(value.name, 'name'),
    email: email(value.email),
    password: password(value.password),
    role: role(value.role),
  };
}

export function validateUpdateUser(body: unknown): UpdateUserInput {
  const value = body as Record<string, unknown>;
  const result: UpdateUserInput = {};
  if ('name' in value) result.name = requiredText(value.name, 'name');
  if ('email' in value) result.email = email(value.email);
  if ('password' in value) result.password = password(value.password);
  if ('role' in value) result.role = role(value.role);
  if ('active' in value) {
    if (typeof value.active !== 'boolean') {
      throw new ApiError(400, 'Datos de usuario inválidos', { active: 'Debe ser verdadero o falso' });
    }
    result.active = value.active;
  }
  if (Object.keys(result).length === 0) {
    throw new ApiError(400, 'Debe indicar al menos un campo para actualizar');
  }
  return result;
}
