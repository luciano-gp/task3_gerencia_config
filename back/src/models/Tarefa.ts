import { Document, Schema, Types, model } from 'mongoose';

export interface ITarefa extends Document {
  descricao: string;
  data_criacao: Date;
  data_prevista: Date;
  data_encerramento?: Date;
  situacao: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  usuario: Types.ObjectId;
}

export interface TarefaFiltro {
  usuario: string;
  situacao?: string;
  data_prevista?: {
    $gte?: Date;
    $lte?: Date;
  };
}

const TarefaSchema = new Schema<ITarefa>({
  descricao: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
  data_prevista: { type: Date, required: true },
  data_encerramento: { type: Date },
  situacao: {
    type: String,
    enum: ['pendente', 'em_andamento', 'concluida', 'cancelada'],
    default: 'pendente',
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

export const Tarefa = model<ITarefa>('Tarefa', TarefaSchema);
