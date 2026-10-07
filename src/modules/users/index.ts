import { Router } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import { ApiError } from '../../errors/ApiError.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createUser, listUsers, updateUser } from './user.service.js';
import { validateCreateUser, validateUpdateUser } from './user.validation.js';

export const usersRouter = Router();

usersRouter.use(authenticate, authorize('ADMINISTRADOR'));

usersRouter.get('/', async (_req, res, next) => {
  try {
    res.json({ data: await listUsers() });
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    res.status(201).json({ data: await createUser(validateCreateUser(req.body)) });
  } catch (error) {
    next(error);
  }
});

usersRouter.patch('/:id', async (req, res, next) => {
  try {
    const input = validateUpdateUser(req.body);
    const authenticatedId = (req.auth as JwtPayload).sub;
    if (req.params.id === authenticatedId && (input.active === false || input.role === 'GUARDA')) {
      throw new ApiError(400, 'No puede desactivar su propia cuenta ni retirar su rol de administrador');
    }
    res.json({ data: await updateUser(req.params.id, input) });
  } catch (error) {
    next(error);
  }
});
