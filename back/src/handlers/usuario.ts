import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";
import { gerarToken } from "../services/gerarToken";
import { notificarNovoUsuario } from "../services/notificador";

// Cadastro
export const cadastroHandler = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({ nome, email, senha: senhaHash });
  await usuario.save();

  notificarNovoUsuario(usuario);

  res.status(201).json(usuario);
};

// Login
export const loginHandler = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const accessToken = gerarToken(usuario!._id as string, "15m");
  const refreshToken = gerarToken(usuario!._id as string, "7d");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 86400000,
  });

  res.json({ accessToken });
};

// Refresh Token
export const refreshTokenHandler = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ error: "Refresh token ausente" });
    return;
  }

  try {
    const payload = jwt.verify(token, "secreto") as { usuario_id: string };

    const accessToken = gerarToken(payload!.usuario_id as string, "15m");

    res.json({ token: accessToken });
  } catch {
    res.status(403).json({ error: "Refresh token inválido ou expirado" });
  }
};
