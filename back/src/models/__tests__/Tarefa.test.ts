import { Types } from "mongoose";
import { Tarefa } from "../../models/Tarefa";

describe("Tarefa model", () => {
  const usuarioId = new Types.ObjectId();

  it("deve exigir a descrição ao criar tarefa", () => {
    const tarefa = new Tarefa({ data_prevista: new Date(), usuario: usuarioId });
    const erro = tarefa.validateSync();

    expect(erro?.errors?.descricao?.message).toBe(
      "Path `descricao` is required."
    );
  });

  it("deve exigir a data_prevista ao criar tarefa", () => {
    const tarefa = new Tarefa({
      descricao: "Teste Unitário",
      usuario: usuarioId,
    });
    const erro = tarefa.validateSync();

    expect(erro?.errors?.data_prevista?.message).toBe(
      "Path `data_prevista` is required."
    );
  });

  it('deve aceitar situação de tarefa "cancelada"', () => {
    const tarefa = new Tarefa({
      descricao: "Teste",
      data_prevista: new Date(),
      situacao: "cancelada",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve aceitar situação de tarefa "coincluida"', () => {
    const tarefa = new Tarefa({
      descricao: "Teste",
      data_prevista: new Date(),
      situacao: "concluida",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve aceitar situação de tarefa "em_andamento"', () => {
    const tarefa = new Tarefa({
      descricao: "Teste",
      data_prevista: new Date(),
      situacao: "em_andamento",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve aceitar situação de tarefa "pendente"', () => {
    const tarefa = new Tarefa({
      descricao: "Teste",
      data_prevista: new Date(),
      situacao: "pendente",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro).toBeUndefined();
  });

  it('deve recusar situação de tarefa "inválida"', () => {
    const tarefa = new Tarefa({
      descricao: "Teste",
      data_prevista: new Date(),
      situacao: "invalida",
      usuario: usuarioId,
    });

    const erro = tarefa.validateSync();
    expect(erro?.errors?.situacao?.kind).toBe("enum");
  });
});
