import { ITarefa } from "../models/Tarefa";
import { IUsuario, Usuario } from "../models/Usuario";
import { enviarEmail } from "./email";

export const notificarTarefa = async (
  tipo: "criada" | "atualizada",
  tarefa: ITarefa
) => {
  try {
    const usuario = await Usuario.findById(tarefa.usuario);
    if (!usuario || !usuario.email) {
      console.warn(
        `Usuário não encontrado ou sem e-mail para tarefa ${tarefa._id}`
      );
      return;
    }

    const titulo =
      tipo === "criada" ? "Nova Tarefa Criada" : "Tarefa Atualizada";

    const conteudo = `
    <p>Olá, ${usuario.nome || "usuário"}!</p>
    <p>A tarefa <strong>${tarefa.titulo}</strong> foi ${tipo}.</p>
    <p><strong>Descrição:</strong> ${tarefa.descricao}</p>
    <p><strong>Situação:</strong> ${tarefa.situacao}</p>
    <p><strong>Data prevista:</strong> ${new Date(
      tarefa.data_prevista
    ).toLocaleDateString()}</p>
  `;

    await enviarEmail(usuario.email, titulo, conteudo);
  } catch (error) {
    console.error(
      `Erro ao notificar usuário sobre a tarefa ${tarefa._id}:`,
      error
    );
  }
};

export const notificarNovoUsuario = async (usuario: IUsuario) => {
  try {
    if (!usuario.email) {
      console.warn(`Usuário criado sem e-mail. ID: ${usuario._id}`);
      return;
    }

    const titulo = "Cadastro realizado com sucesso!";
    const conteudo = `
      <p>Olá, ${usuario.nome || "usuário"}!</p>
      <p>Seu cadastro foi realizado com sucesso.</p>
      <p>Você já pode começar a criar e organizar suas tarefas!</p>
    `;

    await enviarEmail(usuario.email, titulo, conteudo);
  } catch (error) {
    console.error(
      `Erro ao notificar usuário sobre o cadastro ${usuario._id}:`,
      error
    );
  }
};
