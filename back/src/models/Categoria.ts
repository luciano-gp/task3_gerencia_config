import { Document, Schema, model } from 'mongoose';

export interface ICategoria extends Document {
  descricao: string;
}

const CategoriaSchema = new Schema<ICategoria>({
  descricao: { type: String, required: true },
});

export const Categoria = model<ICategoria>('Categoria', CategoriaSchema);
