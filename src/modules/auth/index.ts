import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate.js';
import { login } from './auth.service.js';
import { validateLogin } from './auth.validation.js';

export const authModule = { key: 'auth', status: 'implemented', strategy: 'JWT HS256' } as const;
export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    res.json(await login(validateLogin(req.body)));
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticate, (req, res) => {
  res.json({ data: req.auth });
});

authRouter.post('/logout', authenticate, (_req, res) => {
  res.status(204).send();
});
