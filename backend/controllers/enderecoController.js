// controllers/enderecoController.js
import enderecoService from "../services/enderecoService.js";
import { AppError } from "../utils/error.js";

async function criarEndereco(req, res) {
  try {
    const usuarioId = req.user.id;
    const endereco = await enderecoService.criarEndereco(usuarioId, req.body);

    return res.status(201).json(endereco);
  } catch (err) {
    console.error("enderecoController.criarEndereco:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao criar endereço." });
  }
}

async function getEndereco(req, res) {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;

    const endereco = await enderecoService.getEndereco(id, usuarioId);

    return res.status(200).json(endereco);
  } catch (err) {
    console.error("enderecoController.getEndereco:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar endereço." });
  }
}

async function atualizarEndereco(req, res) {
  try {
    const usuarioId = req.user.id;
    const { id } = req.params;

    const enderecoAtualizado = await enderecoService.atualizarEndereco(
      id,
      usuarioId,
      req.body
    );

    return res.status(200).json(enderecoAtualizado);
  } catch (err) {
    console.error("enderecoController.atualizarEndereco:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao atualizar endereço." });
  }
}

async function listarEnderecos(req, res) {
  try {
    const usuarioId = req.user.id;

    const lista = await enderecoService.listarEnderecosDoUsuario(usuarioId);

    return res.status(200).json(lista);
  } catch (err) {
    console.error("enderecoController.listarEnderecos:", err);

    return res.status(500).json({ message: "Erro ao buscar endereços." });
  }
}

export default {
  criarEndereco,
  getEndereco,
  atualizarEndereco,
  listarEnderecos
};
