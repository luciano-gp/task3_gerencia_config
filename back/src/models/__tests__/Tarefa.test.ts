import { Types } from "mongoose";
import { Tarefa } from "../../models/Tarefa";

describe("Tarefa model", () => {
  const usuarioId = new Types.ObjectId();

  it("deve exigir o titulo ao criar tarefa", () => {
    const tarefa = new Tarefa({ data_prevista: new Date(), usuario: usuarioId });
    const erro = tarefa.validateSync();

    expect(erro?.errors?.titulo?.message).toBe(
      "Path `titulo` is required."
    );
  });

  it("deve exigir a data_prevista ao criar tarefa", () => {
    const tarefa = new Tarefa({
      titulo: "Teste Unitário",
      usuario: usuarioId,
    });
    const erro = tarefa.validateSync();

    expect(erro?.errors?.data_prevista?.message).toBe(
      "Path `data_prevista` is required."
    );
  });

  it('deve aceitar situação de tarefa "concluida"', () => {
    const tarefa = new Tarefa({
      titulo: "Teste",
      data_prevista: new Date(),
      situacao: "concluida",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve aceitar situação de tarefa "em_andamento"', () => {
    const tarefa = new Tarefa({
      titulo: "Teste",
      data_prevista: new Date(),
      situacao: "em_andamento",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve aceitar situação de tarefa "pendente"', () => {
    const tarefa = new Tarefa({
      titulo: "Teste",
      data_prevista: new Date(),
      situacao: "pendente",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve recusar situação de tarefa "inválida"', () => {
    const tarefa = new Tarefa({
      titulo: "Teste",
      data_prevista: new Date(),
      situacao: "invalida",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro?.errors?.situacao?.kind).toBe("enum");
  });
});
