import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';
import tarefaRoutes from './routes/tarefa';
import usuarioRoutes from './routes/usuario';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

app.use(tarefaRoutes);
app.use(usuarioRoutes);

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

export default app;
