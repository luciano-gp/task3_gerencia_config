import { Document, Schema, model } from 'mongoose';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
}

const UsuarioSchema = new Schema<IUsuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

export const Usuario = model<IUsuario>('Usuario', UsuarioSchema);
