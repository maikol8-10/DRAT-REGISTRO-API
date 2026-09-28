import { UniqueConstraintError } from 'sequelize';

import { ApiError } from '../../errors/ApiError.js';
import { hashPassword } from './password.js';
import { getUserModel } from './user.model.js';
import type { CreateUserInput, UpdateUserInput } from './user.types.js';

const PUBLIC_ATTRIBUTES = ['id', 'name', 'email', 'role', 'active', 'createdAt', 'updatedAt'] as const;

export async function listUsers() {
  return getUserModel().findAll({ attributes: [...PUBLIC_ATTRIBUTES], order: [['name', 'ASC']] });
}

export async function createUser(input: CreateUserInput) {
  try {
    const user = await getUserModel().create({
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash: await hashPassword(input.password),
    });
    return getUserModel().findByPk(user.id, { attributes: [...PUBLIC_ATTRIBUTES] });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ApiError(409, 'Ya existe un usuario con ese correo');
    }
    throw error;
  }
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const user = await getUserModel().findByPk(id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');

  const { password, ...changes } = input;
  try {
    await user.update({
      ...changes,
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ApiError(409, 'Ya existe un usuario con ese correo');
    }
    throw error;
  }
  return getUserModel().findByPk(id, { attributes: [...PUBLIC_ATTRIBUTES] });
}
