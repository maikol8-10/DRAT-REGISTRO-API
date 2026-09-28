import { Router } from 'express';

import { moduleRegistry } from '../modules/index.js';
import { usersRouter } from '../modules/users/index.js';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'SICAF API',
    version: '1.0.0',
    modules: moduleRegistry,
  });
});

apiRouter.use('/users', usersRouter);
