export interface ITarefa {
  _id: string;
  titulo: string;
  descricao?: string;
  descricao2?: string;
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
