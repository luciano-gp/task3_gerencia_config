import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuario_id?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
    return 
  }

  try {
    const decoded = jwt.verify(token, 'secreto') as { usuario_id: string };
    req.usuario_id = decoded.usuario_id;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
    return
  }
};
