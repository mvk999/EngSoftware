// controllers/clienteController.js
import { AppError } from "../utils/error.js";
import clienteServices from "../services/clienteServices.js";

async function createCliente(req, res) {
  try {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({
        code: 400,
        message: "Nome, email, CPF e senha são obrigatórios.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ code: 400, message: "Email inválido." });
    }

    const cpfRegex = /^[0-9]{11}$/;
    if (!cpfRegex.test(cpf)) {
      return res.status(400).json({ code: 400, message: "CPF inválido." });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        code: 400,
        message: "A senha deve conter pelo menos 6 caracteres.",
      });
    }

    const novoCliente = await clienteServices.createCliente(
      nome,
      email,
      cpf,
      senha
    );

    // Swagger: schema Cliente (id, nome, email, cpf, tipo)
    return res.status(201).json({
      id: novoCliente.id_usuario,
      nome: novoCliente.nome,
      email: novoCliente.email,
      cpf: novoCliente.cpf,
      tipo: novoCliente.tipo,
    });
  } catch (err) {
    console.error(err);

    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json({ code: err.statusCode, message: err.message });
    }

    return res
      .status(500)
      .json({ code: 500, message: "Erro ao criar cliente" });
  }
}
async function getClienteById(req, res) {
  try {
    const { id } = req.params;

    const cliente = await clienteServices.getClienteById(id);

    return res.status(200).json({
      id: cliente.id_usuario,
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      tipo: cliente.tipo
    });
  } catch (err) {
    console.error("clienteController.getClienteById:", err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        code: err.statusCode,
        message: err.message,
      });
    }

    return res
      .status(500)
      .json({ code: 500, message: "Erro ao buscar cliente." });
  }
}


export default { 
  createCliente,
  getClienteById
};

