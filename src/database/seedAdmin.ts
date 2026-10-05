import { database } from '../config/database.js';
import { hashPassword } from '../modules/users/password.js';
import { getUserModel } from '../modules/users/user.model.js';

const name = process.env.INITIAL_ADMIN_NAME?.trim();
const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.INITIAL_ADMIN_PASSWORD;

if (!name || !email || !password) {
  throw new Error('Defina INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD');
}

if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
  throw new Error('INITIAL_ADMIN_PASSWORD debe tener 8 caracteres, mayúscula, minúscula y número');
}

const [user, created] = await getUserModel().findOrCreate({
  where: { email },
  defaults: {
    name,
    email,
    passwordHash: await hashPassword(password),
    role: 'ADMINISTRADOR',
  },
});

console.log(created ? `Administrador creado: ${user.email}` : `El administrador ya existe: ${user.email}`);
await database?.close();
