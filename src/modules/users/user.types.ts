export const USER_ROLES = ['ADMINISTRADOR', 'GUARDA'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & {
  password?: string;
  active?: boolean;
};
