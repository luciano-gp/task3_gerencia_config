import PDFDocument from 'pdfkit';
import { Tarefa } from '../../models/Tarefa';
import { gerarRelatorioDeTarefas } from '../relatorio';

jest.mock('pdfkit');
jest.mock('../../models/Tarefa');

describe('gerarRelatorioDeTarefas', () => {
  const mockTarefas = [
    {
      titulo: 'Tarefa 1',
      situacao: 'pendente',
      data_prevista: new Date('2025-05-10'),
      data_criacao: new Date('2025-05-01'),
    },
  ];

  const res = {
    setHeader: jest.fn(),
    end: jest.fn(),
  } as any;

  const mockPDFDoc = {
    pipe: jest.fn(),
    fontSize: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    end: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Tarefa.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockTarefas),
    });

    (PDFDocument as unknown as jest.Mock).mockImplementation(() => mockPDFDoc);
  });

  it('deve gerar um PDF com os dados das tarefas', async () => {
    await gerarRelatorioDeTarefas('user123', res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'inline; filename="relatorio.pdf"'
    );
    expect(mockPDFDoc.pipe).toHaveBeenCalledWith(res);
    expect(mockPDFDoc.text).toHaveBeenCalledWith('Relatório de Tarefas', { align: 'center' });
    expect(mockPDFDoc.end).toHaveBeenCalled();
  });
});
