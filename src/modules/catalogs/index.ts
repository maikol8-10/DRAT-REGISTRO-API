import { Router } from 'express';

import { ApiError } from '../../errors/ApiError.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createEmployee, listEmployees, updateEmployee } from './employees/employee.service.js';
import { validateCreateEmployee, validateUpdateEmployee } from './employees/employee.validation.js';

export const catalogsModule = { key: 'catalogs', status: 'in_progress' } as const;
export const catalogsRouter = Router();

catalogsRouter.use(authenticate);

catalogsRouter.get('/employees', authorize('ADMINISTRADOR', 'GUARDA'), async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    res.json({ data: await listEmployees(search) });
  } catch (error) {
    next(error);
  }
});

catalogsRouter.post('/employees', authorize('ADMINISTRADOR'), async (req, res, next) => {
  try {
    res.status(201).json({ data: await createEmployee(validateCreateEmployee(req.body)) });
  } catch (error) {
    next(error);
  }
});

catalogsRouter.patch('/employees/:id', authorize('ADMINISTRADOR'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') throw new ApiError(400, 'Identificador de funcionario inválido');
    res.json({ data: await updateEmployee(id, validateUpdateEmployee(req.body)) });
  } catch (error) {
    next(error);
  }
});
