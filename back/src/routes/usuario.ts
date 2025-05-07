import bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';

const router = Router();

// Cadastro
router.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({ nome, email, senha: senhaHash });
  await usuario.save();

  res.status(201).json(usuario);
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ usuario_id: usuario!._id }, 'secreto', { expiresIn: '1d' });
  res.json({ token });
});

export default router;
