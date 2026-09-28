import { Sequelize } from 'sequelize';

import { env } from './env.js';

export const database = env.databaseUrl
  ? new Sequelize(env.databaseUrl, {
      dialect: 'postgres',
      logging: env.nodeEnv === 'development' ? console.debug : false,
      define: { underscored: true, timestamps: true },
    })
  : null;

export function requireDatabase() {
  if (!database) {
    throw new Error('DATABASE_URL no está configurada');
  }

  return database;
}

export async function checkDatabase() {
  if (!database || !env.databaseCheckEnabled) {
    return {
      status: database ? 'check_disabled' : 'not_configured',
      dialect: 'postgresql',
    } as const;
  }

  try {
    await database.authenticate();
    return { status: 'connected', dialect: 'postgresql' } as const;
  } catch {
    return { status: 'unavailable', dialect: 'postgresql' } as const;
  }
}
