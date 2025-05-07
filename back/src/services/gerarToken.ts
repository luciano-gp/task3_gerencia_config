import jwt, { SignOptions } from 'jsonwebtoken';

export const gerarToken = (usuario_id: string, duracao: SignOptions['expiresIn'] = '15m') => {
    return jwt.sign({ userId: usuario_id }, 'secreto', { expiresIn: duracao });
  };