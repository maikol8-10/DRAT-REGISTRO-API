import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`SICAF API disponible en http://localhost:${env.port}`);
});

function shutdown(signal: string) {
  console.log(`${signal} recibido. Cerrando SICAF API...`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
