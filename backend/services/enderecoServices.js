// services/enderecoService.js
import enderecoRepository from "../repositories/enderecoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";

async function criarEndereco(idUsuario, dados) {
  const { rua, numero, bairro, cidade, estado, cep } = dados;

  if (!rua || !numero || !bairro || !cidade || !estado || !cep)
    throw new AppError("Todos os campos de endereço são obrigatórios.", 400);

  const cliente = await clienteRepository.getCliente(idUsuario);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  return await enderecoRepository.criarEndereco(
    idUsuario, rua, numero, bairro, cidade, estado, cep
  );
}

async function getEndereco(idEndereco, userId) {
  const endereco = await enderecoRepository.getEndereco(idEndereco);
  if (!endereco) throw new AppError("Endereço não encontrado.", 404);

  // Usuário só pode ver o próprio endereço
  if (endereco.id_usuario !== userId)
    throw new AppError("Sem permissão.", 403);

  return endereco;
}

async function atualizarEndereco(idEndereco, userId, dados) {
  const existente = await enderecoRepository.getEndereco(idEndereco);
  if (!existente) throw new AppError("Endereço não encontrado.", 404);

  if (existente.id_usuario !== userId)
    throw new AppError("Sem permissão.", 403);

  const { rua, numero, bairro, cidade, estado, cep } = dados;

  return await enderecoRepository.atualizarEndereco(
    idEndereco, rua, numero, bairro, cidade, estado, cep
  );
}

async function listarEnderecosDoUsuario(idUsuario) {
  return await enderecoRepository.getEnderecosByUsuario(idUsuario);
}

export default {
  criarEndereco,
  getEndereco,
  atualizarEndereco,
  listarEnderecosDoUsuario
};
