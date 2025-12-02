// services/clienteServices.js
import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";
import { hashPassword } from "../utils/password.js";

async function createCliente(nome, email, cpf, senha) {
  if (!nome || nome.trim().length === 0) {
    throw new AppError("O nome é obrigatório.", 400);
  }

  // Email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new AppError("Email inválido.", 400);
  }

  // CPF válido
  const cpfRegex = /^[0-9]{11}$/;
  if (!cpf || !cpfRegex.test(cpf)) {
    throw new AppError("CPF inválido. Informe um CPF com 11 dígitos.", 400);
  }

  // Senha válida
  if (!senha || senha.length < 6) {
    throw new AppError("A senha deve conter pelo menos 6 caracteres.", 400);
  }

  // Unicidade de email
  const emailExiste = await clienteRepository.getClienteByEmail(email);
  if (emailExiste) {
    throw new AppError("Email já está em uso.", 400);
  }

  // Unicidade de CPF
  const cpfExiste = await clienteRepository.getClienteByCPF(cpf);
  if (cpfExiste) {
    throw new AppError("CPF já cadastrado.", 400);
  }

  const senhaHash = await hashPassword(senha);

  const novoCliente = await clienteRepository.createCliente(
    nome.trim(),
    email.trim().toLowerCase(),
    cpf.trim(),
    senhaHash
  );

  return novoCliente;
}
async function getClienteById(id) {
  if (!id) throw new AppError("ID inválido.", 400);

  const cliente = await clienteRepository.getCliente(id);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  return cliente;
}


export default {
  createCliente,
  getClienteById
};

