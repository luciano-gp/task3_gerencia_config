import nodemailer from 'nodemailer';
import { enviarEmail } from '../email';

jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('enviarEmail', () => {
  it('deve chamar função de envio de email com os dados corretos', async () => {
    const mockSendMail = jest.fn().mockResolvedValue('OK');

    mockedNodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail } as any);

    await enviarEmail('teste@exemplo.com', 'Assunto Teste', '<p>Conteúdo</p>');

    expect(mockedNodemailer.createTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"Tarefas API" <${process.env.EMAIL_USER}>`,
      to: 'teste@exemplo.com',
      subject: 'Assunto Teste',
      html: '<p>Conteúdo</p>',
    });
  });
});
