import { Router } from 'express';

import { ApiError } from '../../errors/ApiError.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createManualMovement, createNfcMovement, getCurrentPresenceCount, resolveManualMovement, resolveNfcMovement } from './employeeMovement.service.js';
import type { MovementSource, MovementType } from './employeeMovement.model.js';

export const movementsModule = { key: 'movements', status: 'in_progress' } as const;
export const movementsRouter = Router();

movementsRouter.use(authenticate, authorize('ADMINISTRADOR', 'GUARDA'));

movementsRouter.post('/employees/nfc/resolve', async (req, res, next) => {
  try {
    if (typeof req.body?.code !== 'string') throw new ApiError(400, 'Código NFC requerido');
    res.json({ data: await resolveNfcMovement(req.body.code) });
  } catch (error) { next(error); }
});

movementsRouter.post('/employees/nfc', async (req, res, next) => {
  try {
    const auth = typeof req.auth === 'object' ? req.auth : undefined;
    if (typeof auth?.sub !== 'string') throw new ApiError(401, 'No autorizado');
    if (!['INGRESO', 'SALIDA'].includes(req.body?.movementType)) throw new ApiError(400, 'Tipo de movimiento inválido');
    if (!['NFC_SIMULADO', 'NFC_FISICO'].includes(req.body?.source)) throw new ApiError(400, 'Origen del movimiento inválido');
    res.status(201).json({ data: await createNfcMovement({ code: req.body.code, movementType: req.body.movementType as MovementType, source: req.body.source as MovementSource, confirmedByUserId: auth.sub }) });
  } catch (error) { next(error); }
});

movementsRouter.post('/employees/manual/resolve', async (req, res, next) => {
  try {
    if (typeof req.body?.employeeId !== 'string') throw new ApiError(400, 'Funcionario requerido');
    res.json({ data: await resolveManualMovement(req.body.employeeId) });
  } catch (error) { next(error); }
});

movementsRouter.post('/employees/manual', async (req, res, next) => {
  try {
    const auth = typeof req.auth === 'object' ? req.auth : undefined;
    if (typeof auth?.sub !== 'string') throw new ApiError(401, 'No autorizado');
    if (typeof req.body?.employeeId !== 'string') throw new ApiError(400, 'Funcionario requerido');
    if (!['INGRESO', 'SALIDA'].includes(req.body?.movementType)) throw new ApiError(400, 'Tipo de movimiento inválido');
    res.status(201).json({ data: await createManualMovement({ employeeId: req.body.employeeId, movementType: req.body.movementType as MovementType, confirmedByUserId: auth.sub }) });
  } catch (error) { next(error); }
});

movementsRouter.get('/employees/presence/count', async (_req, res, next) => {
  try { res.json({ data: { count: await getCurrentPresenceCount() } }); } catch (error) { next(error); }
});
