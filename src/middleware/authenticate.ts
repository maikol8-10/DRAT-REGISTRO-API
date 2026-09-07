import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const [scheme, token] = req.header('authorization')?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token || !env.jwtSecret) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    req.auth = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o vencido' });
  }
}
