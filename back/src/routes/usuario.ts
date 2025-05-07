import bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';
import { notificarNovoUsuario } from '../services/notificador';

const router = Router();

// Cadastro
router.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({ nome, email, senha: senhaHash });
  await usuario.save();

  notificarNovoUsuario(usuario);

  res.status(201).json(usuario);
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const accessToken = jwt.sign({ userId: usuario!._id }, 'secreto', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: usuario!._id }, 'secreto', { expiresIn: '7d' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7 * 86400000
  });

  res.json({ accessToken });
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ error: 'Refresh token ausente' });
    return;
  }
  
  try {
    const payload = jwt.verify(token, 'secreto') as { userId: string };

    const accessToken = jwt.sign({ userId: payload.userId }, 'secreto', { expiresIn: '15m' });

    res.json({ token: accessToken });
  } catch {
    res.status(403).json({ error: 'Refresh token inválido ou expirado' });
  }
});

export default router;
