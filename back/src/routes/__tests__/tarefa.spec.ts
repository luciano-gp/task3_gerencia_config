import {
  atualizarHandler,
  buscarHandler,
  criarHandler,
  deletarHandler,
  editarHandler,
  listarHandler,
  relatorioHandler,
} from "../../handlers/tarefa";
// import { Tarefa } from "../../models/Tarefa";
import { notificarTarefa } from "../../services/notificador";
import { gerarRelatorioDeTarefas } from "../../services/relatorio";

jest.mock("../../services/relatorio");
jest.mock("../../services/notificador");

jest.unmock("../../models/Tarefa");
const { Tarefa } = require("../../models/Tarefa");

describe("handlers de tarefa", () => {
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("buscarHandler deve retornar a tarefa se encontrada", async () => {
    const mockReq: any = {
      params: { id: "tarefa123" },
      usuario_id: "user123",
    };
    const tarefaFake = { _id: "tarefa123", titulo: "desc" };
    jest.spyOn(Tarefa, "findOne").mockResolvedValue(tarefaFake as any);
    await buscarHandler(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(tarefaFake);
  });

  it("buscarHandler deve retornar 404 se não encontrar tarefa", async () => {
    const mockReq: any = { params: { id: "id" }, usuario_id: "user" };
    jest.spyOn(Tarefa, "findOne").mockResolvedValue(null);
    await buscarHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Tarefa não encontrada",
    });
  });

  it("listarHandler deve retornar tarefas paginadas com total", async () => {
    const mockReq: any = {
      query: {},
      usuario_id: "user123",
    };
    jest.spyOn(Tarefa, "find").mockReturnValue({
      sort: () => ({
        skip: () => ({ limit: () => Promise.resolve(["t1", "t2"]) }),
      }),
    } as any);
    jest.spyOn(Tarefa, "countDocuments").mockResolvedValue(2);
    await listarHandler(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ tarefas: ["t1", "t2"], total: 2 })
    );
  });

  it("criarHandler deve criar uma nova tarefa e notificar", async () => {
    const mockReq: any = {
      body: { titulo: "Nova tarefa", data_prevista: new Date() },
      usuario_id: "user123",
    };
  
    const saveMock = jest.spyOn(Tarefa.prototype, 'save').mockResolvedValue(undefined);
  
    await criarHandler(mockReq, mockRes);
  
    expect(saveMock).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
    expect(notificarTarefa).toHaveBeenCalled();
  });

  it("editarHandler deve editar tarefa existente e notificar", async () => {
    const mockReq: any = {
      params: { id: "id1" },
      usuario_id: "user1",
      body: { titulo: "editada" },
    };
    jest
      .spyOn(Tarefa, "findOneAndUpdate")
      .mockResolvedValue({ titulo: "editada" } as any);
    await editarHandler(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: "editada" })
    );
    expect(notificarTarefa).toHaveBeenCalled();
  });

  it("editarHandler deve retornar 404 se tarefa não encontrada", async () => {
    const mockReq: any = { params: { id: "x" }, usuario_id: "u", body: {} };
    jest.spyOn(Tarefa, "findOneAndUpdate").mockResolvedValue(null);
    await editarHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Tarefa não encontrada",
    });
  });

  it("atualizarHandler deve atualizar campos permitidos e notificar", async () => {
    const mockReq: any = {
      params: { id: "id1" },
      usuario_id: "user1",
      body: { titulo: "Atualizada", situacao: "concluida" },
    };
    jest
      .spyOn(Tarefa, "findOneAndUpdate")
      .mockResolvedValue({ titulo: "Atualizada" } as any);
    await atualizarHandler(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: "Atualizada" })
    );
    expect(notificarTarefa).toHaveBeenCalled();
  });

  it("atualizarHandler deve retornar 404 se tarefa não encontrada", async () => {
    const mockReq: any = { params: { id: "x" }, usuario_id: "u", body: {} };
    jest.spyOn(Tarefa, "findOneAndUpdate").mockResolvedValue(null);
    await atualizarHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Tarefa não encontrada",
    });
  });

  it("deletarHandler deve deletar tarefa e retornar sucesso", async () => {
    const mockReq: any = {
      params: { id: "id1" },
      usuario_id: "user1",
    };
    jest
      .spyOn(Tarefa, "findOneAndDelete")
      .mockResolvedValue({ _id: "id1" } as any);
    await deletarHandler(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({
      mensagem: "Tarefa removida com sucesso",
    });
  });

  it("deletarHandler deve retornar 404 se tarefa não encontrada", async () => {
    const mockReq: any = { params: { id: "x" }, usuario_id: "u" };
    jest.spyOn(Tarefa, "findOneAndDelete").mockResolvedValue(null);
    await deletarHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Tarefa não encontrada",
    });
  });

  it("relatorioHandler deve chamar gerarRelatorioDeTarefas", async () => {
    const mockReq: any = { usuario_id: "user1" };
    await relatorioHandler(mockReq, mockRes);
    expect(gerarRelatorioDeTarefas).toHaveBeenCalledWith("user1", mockRes);
  });

  it("relatorioHandler deve retornar 500 em caso de erro", async () => {
    const mockReq: any = { usuario_id: "user1" };
    (gerarRelatorioDeTarefas as jest.Mock).mockRejectedValue(new Error("Erro"));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await relatorioHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Erro ao gerar relatório",
    });
  });
});
