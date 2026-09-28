import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '../modules/users/user.types.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth;
    const role = typeof auth === 'object' ? auth.role : undefined;

    if (typeof role !== 'string' || !allowedRoles.includes(role as UserRole)) {
      res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
      return;
    }

    next();
  };
}
