import { model, Schema, Types } from 'mongoose';

const RefreshTokenSchema = new Schema({
  usuario: { type: Types.ObjectId, ref: 'Usuario', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export const RefreshToken = model('RefreshToken', RefreshTokenSchema);
