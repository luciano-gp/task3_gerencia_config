import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import tarefaRoutes from './routes/tarefa';
import usuarioRoutes from './routes/usuario';

dotenv.config();

const app = express();

app.use(express.json());

app.use(tarefaRoutes);
app.use(usuarioRoutes);

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

export default app;
