import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Tarefa } from './models/Tarefa';
import { Usuario } from './models/Usuario';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const email = 'luciano@email.com';
  const senha = 'admin';

  const count = await Tarefa.countDocuments();
  let usuario = await Usuario.findOne({ email });

  if (count > 0 && usuario) {
    console.log('Tarefas já existentes. Seed ignorado.');
    return mongoose.disconnect();
  }

  if (!usuario) {
    const senhaHash = await bcrypt.hash(senha, 10);
    usuario = new Usuario({
      nome: 'Luciano',
      email,
      senha: senhaHash,
    });
    await usuario.save();
    usuario = await Usuario.findOne({ email });
    console.log('Usuário criado:', email);
  } else {
    console.log('Usuário já existente:', email);
  }

  const agora = Date.now();

  const tarefas = [
    {
      titulo: 'Estudar TypeScript',
      descricao: 'Revisar conceitos básicos e avançados',
      data_criacao: new Date(agora - 10 * 86400000),
      data_prevista: new Date(agora - 7 * 86400000),
      situacao: 'concluida',
      data_encerramento: new Date(agora - 6 * 86400000),
    },
    {
      titulo: 'Finalizar projeto de API',
      descricao: 'Adicionar autenticação e documentação',
      data_criacao: new Date(agora - 9 * 86400000),
      data_prevista: new Date(agora + 1 * 86400000),
      situacao: 'em_andamento',
    },
    {
      titulo: 'Apresentar trabalho da faculdade',
      descricao: 'Preparar slides e ensaiar apresentação',
      data_criacao: new Date(agora - 8 * 86400000),
      data_prevista: new Date(agora - 2 * 86400000),
      situacao: 'concluida',
      data_encerramento: new Date(agora - 1 * 86400000),
    },
    {
      titulo: 'Fazer backup do sistema',
      descricao: 'Salvar dados importantes em nuvem',
      data_criacao: new Date(agora - 7 * 86400000),
      data_prevista: new Date(agora - 5 * 86400000),
      situacao: 'em_andamento',
      data_encerramento: new Date(agora - 4 * 86400000),
    },
    {
      titulo: 'Revisar código do colega',
      descricao: 'Dar feedback sobre o código do projeto',
      data_criacao: new Date(agora - 6 * 86400000),
      data_prevista: new Date(agora + 2 * 86400000),
      situacao: 'em_andamento',
    },
    {
      titulo: 'Ler artigo sobre arquitetura de software',
      descricao: 'Analisar boas práticas e padrões',
      data_criacao: new Date(agora - 5 * 86400000),
      data_prevista: new Date(agora + 3 * 86400000),
      situacao: 'pendente',
    },
    {
      titulo: 'Refatorar módulo de autenticação',
      descricao: 'Melhorar segurança e legibilidade do código',
      data_criacao: new Date(agora - 4 * 86400000),
      data_prevista: new Date(agora - 1 * 86400000),
      situacao: 'pendente',
      data_encerramento: new Date(agora),
    },
    {
      titulo: 'Testar integração com API externa',
      descricao: 'Verificar se a comunicação está funcionando corretamente',
      data_criacao: new Date(agora - 3 * 86400000),
      data_prevista: new Date(agora + 5 * 86400000),
      situacao: 'pendente',
    },
    {
      titulo: 'Criar documentação da aplicação',
      descricao: 'Incluir informações sobre instalação e uso',
      data_criacao: new Date(agora - 2 * 86400000),
      data_prevista: new Date(agora + 1 * 86400000),
      situacao: 'pendente',
    },
    {
      titulo: 'Organizar tarefas da sprint',
      data_criacao: new Date(agora - 1 * 86400000),
      data_prevista: new Date(agora + 4 * 86400000),
      situacao: 'em_andamento',
    },
  ].map((tarefa) => ({ ...tarefa, usuario: usuario!._id }));

  await Tarefa.insertMany(tarefas);
  console.log('Seed concluído com sucesso.');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Erro no seed:', err);
  mongoose.disconnect();
});
