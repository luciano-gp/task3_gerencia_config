import { Document, Schema, Types, model } from 'mongoose';

export interface ITarefa extends Document {
  titulo: string;
  descricao: string;
  descricao2: string;
  data_criacao: Date;
  data_prevista: Date;
  data_encerramento?: Date;
  situacao: 'pendente' | 'em_andamento' | 'concluida';
  usuario: Types.ObjectId;
}

export interface ITarefaFiltro {
  usuario: string;
  titulo?: RegExp;
  situacao?: string;
  data_prevista?: {
    $gte?: Date;
    $lte?: Date;
  };
}

const TarefaSchema = new Schema<ITarefa>({
  titulo: { type: String, required: true },
  descricao: { type: String },
  descricao2: { type: String },
  data_criacao: { type: Date, default: Date.now },
  data_prevista: { type: Date, required: true },
  data_encerramento: { type: Date },
  situacao: {
    type: String,
    enum: ['pendente', 'em_andamento', 'concluida'],
    default: 'pendente',
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

export const Tarefa = model<ITarefa>('Tarefa', TarefaSchema);
