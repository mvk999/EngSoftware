import enderecoService from "../services/enderecoServices.js";
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

async function getMeusEnderecos(req, res) {
  try {
    const usuarioId = req.user.id;
    const enderecos = await enderecoService.getEnderecosDoUsuario(usuarioId);
    return res.status(200).json(enderecos);
  } catch (err) {
    console.error("enderecoController.getMeusEnderecos:", err);
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    return res.status(500).json({ message: "Erro ao listar endereços." });
  }
}

// ADMIN: listar endereços de um cliente por ID (protegido por adminMiddleware na rota)
async function getEnderecosByCliente(req, res) {
  try {
    const { id } = req.params;
    const enderecos = await enderecoService.getEnderecosDoUsuario(Number(id));
    return res.status(200).json(enderecos);
  } catch (err) {
    console.error("enderecoController.getEnderecosByCliente:", err);
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });
    return res.status(500).json({ message: "Erro ao listar endereços do cliente." });
  }
}

export default {
  criarEndereco,
  getEndereco,
  getMeusEnderecos,
  getEnderecosByCliente
};
