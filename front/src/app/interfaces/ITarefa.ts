export interface ITarefa {
  _id: string;
  descricao: string;
  data_criacao: Date;
  data_prevista: Date;
  data_encerramento?: Date;
  situacao: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  usuario: string;
}

export interface ITarefaResponse {
  limit: number;
  page: number;
  tarefas: ITarefa[];
  total: number;
  totalPages: number;
}
