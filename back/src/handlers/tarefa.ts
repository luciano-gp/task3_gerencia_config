import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ITarefaFiltro, Tarefa } from '../models/Tarefa';
import { notificarTarefa } from '../services/notificador';
import { gerarRelatorioDeTarefas } from '../services/relatorio';

// Buscar
export const buscarHandler = async (req: AuthRequest, res: Response) => {
  const tarefa = await Tarefa.findOne({ _id: req.params.id, usuario: req.usuario_id });

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  res.json(tarefa);
}

// Listar
export const listarHandler = async (req: AuthRequest, res: Response) => {
  const { situacao, data_inicio, data_fim, page = '1', limit = '10' } = req.query;

  const filtro: ITarefaFiltro = { usuario: req.usuario_id! };

  if (situacao) filtro.situacao = situacao as string;

  if (data_inicio || data_fim) {
    filtro.data_prevista = {};
    if (data_inicio) filtro.data_prevista.$gte = new Date(data_inicio as string);
    if (data_fim) filtro.data_prevista.$lte = new Date(data_fim as string);
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const [tarefas, total] = await Promise.all([
    Tarefa.find(filtro)
      .sort({ data_prevista: 1 })
      .skip(skip)
      .limit(parseInt(limit as string)),

    Tarefa.countDocuments(filtro)
  ]);

  res.json({
    total,
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    totalPages: Math.ceil(total / parseInt(limit as string)),
    tarefas
  });
}

// Criar
export const criarHandler = async (req: AuthRequest, res: Response) => {
  const { descricao, data_prevista } = req.body;
  const tarefa = new Tarefa({
    descricao,
    data_prevista,
    usuario: req.usuario_id,
  });
  await tarefa.save();

  notificarTarefa('criada', tarefa);

  res.status(201).json(tarefa);
}

// Editar
export const editarHandler = async (req: AuthRequest, res: Response) => {
  const { descricao, data_prevista, data_encerramento, situacao } = req.body;

  const tarefa = await Tarefa.findOneAndUpdate(
    { _id: req.params.id, usuario: req.usuario_id },
    { descricao, data_prevista, data_encerramento, situacao },
    { new: true, runValidators: true }
  );

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  notificarTarefa('atualizada', tarefa);

  res.json(tarefa);
}

// Atualizar
export const atualizarHandler = async (req: AuthRequest, res: Response) => {
  const camposPermitidos = ['descricao', 'data_prevista', 'data_encerramento', 'situacao'];
  const atualizacoes: any = {};

  for (const campo of camposPermitidos) {
    if (campo in req.body) atualizacoes[campo] = req.body[campo];
  }

  const tarefa = await Tarefa.findOneAndUpdate(
    { _id: req.params.id, usuario: req.usuario_id },
    atualizacoes,
    { new: true, runValidators: true }
  );

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  notificarTarefa('atualizada', tarefa);

  res.json(tarefa);
}

// Deletar
export const deletarHandler = async (req: AuthRequest, res: Response) => {
  const tarefa = await Tarefa.findOneAndDelete({ _id: req.params.id, usuario: req.usuario_id });

  if (!tarefa) {
    res.status(404).json({ error: 'Tarefa não encontrada' });
    return;
  }

  res.json({ mensagem: 'Tarefa removida com sucesso' });
}

// Relatório
export const relatorioHandler = async (req: AuthRequest, res: Response) => {
  try {
    await gerarRelatorioDeTarefas(req.usuario_id!, res);
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
}