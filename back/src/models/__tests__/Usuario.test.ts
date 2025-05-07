import { Usuario } from '../../models/Usuario';

describe('Model Usuario', () => {
  it('deve exigir o campo email', () => {
    const usuario = new Usuario({ senha: '123456', nome: 'Teste' });
    const erro = usuario.validateSync();

    expect(erro?.errors?.email?.message).toBe('Path `email` is required.');
  });

  it('deve exigir o campo senha', () => {
    const usuario = new Usuario({ email: 'teste@teste.com', nome: 'Teste' });
    const erro = usuario.validateSync();

    expect(erro?.errors?.senha?.message).toBe('Path `senha` is required.');
  });
  
  it('deve exigir o campo nome', () => {
    const usuario = new Usuario({ email: 'teste@teste.com', senha: '123456' });
    const erro = usuario.validateSync();

    expect(erro?.errors?.nome?.message).toBe('Path `nome` is required.');
  });
});
