import { Usuario } from "../../models/Usuario";
import { enviarEmail } from "../../services/email";
import { notificarNovoUsuario, notificarTarefa } from "../notificador";

jest.mock("../../models/Usuario");
jest.mock("../../services/email");

const mockUsuario = {
  _id: "u123",
  nome: "Luciano",
  email: "luciano@email.com",
};

const mockTarefa = {
  _id: "t123",
  usuario: "u123",
  descricao: "Fazer teste unitário",
  situacao: "pendente",
  data_prevista: new Date("2025-05-10"),
} as any;

describe("notificarTarefa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve enviar e-mail quando tarefa é criada", async () => {
    (Usuario.findById as jest.Mock).mockResolvedValue(mockUsuario);
    (enviarEmail as jest.Mock).mockResolvedValue(undefined);

    await notificarTarefa("criada", mockTarefa);

    expect(Usuario.findById).toHaveBeenCalledWith("u123");
    expect(enviarEmail).toHaveBeenCalledWith(
      "luciano@email.com",
      "Nova Tarefa Criada",
      expect.stringContaining("Fazer teste unitário")
    );
  });

  it("não deve enviar e-mail se o usuário não for encontrado", async () => {
    (Usuario.findById as jest.Mock).mockResolvedValue(null);

    await notificarTarefa("criada", mockTarefa);

    expect(enviarEmail).not.toHaveBeenCalled();
  });
});

describe("notificarNovoUsuario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve enviar e-mail ao novo usuário", async () => {
    const usuario = {
      _id: "u123",
      nome: "Luciano",
      email: "luciano@email.com",
    } as any;

    await notificarNovoUsuario(usuario);

    expect(enviarEmail).toHaveBeenCalledWith(
      "luciano@email.com",
      "Cadastro realizado com sucesso!",
      expect.stringContaining("Olá, Luciano")
    );
  });

  it("não deve enviar e-mail se não houver email", async () => {
    const usuario = {
      _id: "u123",
      nome: "Luciano",
      email: null,
    } as any;

    await notificarNovoUsuario(usuario);

    expect(enviarEmail).not.toHaveBeenCalled();
  });
});
