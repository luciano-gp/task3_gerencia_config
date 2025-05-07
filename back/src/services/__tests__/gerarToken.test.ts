import jwt from 'jsonwebtoken';
import { gerarToken } from '../gerarToken';

describe('gerarToken', () => {
  it('deve gerar um token JWT válido com o ID do usuário', () => {
    const token = gerarToken('abc123');

    const decoded = jwt.verify(token, 'secreto') as any;

    expect(decoded.userId).toBe('abc123');
  });

  it('deve gerar um token JWT que irá expirar em 1 dia', () => {
    const token = gerarToken('abc123', '1d');

    const decoded = jwt.decode(token) as any;
    const expiracaoEmSegundos = decoded.exp - decoded.iat;

    expect(expiracaoEmSegundos).toBe(86400);
  });
});
