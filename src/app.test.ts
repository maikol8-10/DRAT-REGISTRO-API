import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from './app.js';

describe('SICAF API', () => {
  it('responde a la comprobación de estado', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'sicaf-api' });
  });

  it('publica el registro de módulos iniciales', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
    expect(response.body.modules).toHaveLength(5);
  });

  it('responde 404 para rutas inexistentes', async () => {
    const response = await request(app).get('/ruta-inexistente');
    expect(response.status).toBe(404);
  });
});
