import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { Tarefa } from '../models/Tarefa';

export const gerarRelatorioDeTarefas = async (
  usuario_id: string,
  res: Response
) => {
  const tarefas = await Tarefa.find({ usuario: usuario_id }).sort({ data_prevista: 1 });

  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="relatorio.pdf"');

  doc.pipe(res);

  doc.fontSize(18).text('Relatório de Tarefas', { align: 'center' });
  doc.moveDown();

  tarefas.forEach((tarefa, i) => {
    doc
      .fontSize(12)
      .text(`${i + 1}. ${tarefa.descricao}`)
      .text(`Situação: ${tarefa.situacao}`)
      .text(`Data prevista: ${new Date(tarefa.data_prevista).toLocaleDateString()}`)
      .text(`Criada em: ${new Date(tarefa.data_criacao).toLocaleDateString()}`)
      .moveDown();
  });

  doc.end();
};
