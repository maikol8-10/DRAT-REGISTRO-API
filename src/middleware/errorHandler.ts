import type { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: 'Recurso no encontrado', path: req.originalUrl });
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
}
