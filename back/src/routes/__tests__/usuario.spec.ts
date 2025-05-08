import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {
    cadastroHandler,
    loginHandler,
    refreshTokenHandler,
} from "../../handlers/usuario";
import { Usuario } from "../../models/Usuario";

jest.spyOn(Usuario.prototype, 'save').mockResolvedValue(undefined);

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../services/notificador");
jest.mock("../../services/gerarToken", () => ({
  gerarToken: jest.fn().mockReturnValue("fakeAccessToken"),
}));

describe("Rotas de Usuário", () => {
  const mockReq: any = { body: {}, cookies: {} };
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /usuarios", () => {
    it("deve cadastrar novo usuário", async () => {
      mockReq.body = {
        nome: "Luciano",
        email: "luciano@email.com",
        senha: "admin",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("senhaHashada");
      (Usuario.prototype.save as jest.Mock).mockResolvedValue({
        _id: "user123",
        nome: "Luciano",
        email: "luciano@email.com",
      });

      await cadastroHandler(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith("admin", 10);
      expect(Usuario.prototype.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
      const data = mockRes.json.mock.calls[0][0];
      expect(data.nome).toBe("Luciano");
      expect(data.email).toBe("luciano@email.com");
    });
  });

  describe("POST /login", () => {
    it("deve autenticar com sucesso e retornar token", async () => {
      mockReq.body = { email: "luciano@email.com", senha: "admin" };

      const usuarioFake = {
        _id: "user123",
        email: "luciano@email.com",
        senha: "senhaHashada",
      };

      jest.spyOn(Usuario, 'findOne').mockResolvedValue(usuarioFake as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await loginHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        accessToken: "fakeAccessToken",
      });
      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "fakeAccessToken",
        expect.any(Object)
      );
    });

    it("deve falhar com credenciais inválidas", async () => {
      mockReq.body = { email: "errado@email.com", senha: "admin" };

      jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);

      await loginHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Credenciais inválidas",
      });
    });
  });

  describe("POST /refresh-token", () => {
    it("deve gerar novo access token com refresh válido", async () => {
      mockReq.cookies.refreshToken = "valid.token";
      (jwt.verify as jest.Mock).mockReturnValue({ usuario_id: "user123" });

      await refreshTokenHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ token: "fakeAccessToken" });
    });

    it("deve retornar erro se token ausente", async () => {
      mockReq.cookies.refreshToken = null;

      await refreshTokenHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Refresh token ausente",
      });
    });

    it("deve retornar erro se token inválido", async () => {
      mockReq.cookies.refreshToken = "invalid";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid");
      });

      await refreshTokenHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Refresh token inválido ou expirado",
      });
    });
  });
});
