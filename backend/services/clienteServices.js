import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";
import { hashPassword } from "../utils/password.js";

async function createCliente(nome, email, cpf, senha) {
    // validações de unicidade
    const emailExiste = await clienteRepository.getClienteByEmail(email);
    if (emailExiste) {
        throw new AppError("Email já está em uso.", 400);
    }

    const cpfExiste = await clienteRepository.getClienteByCPF(cpf);
    if (cpfExiste) {
        throw new AppError("CPF já cadastrado.", 400);
    }

    // criptografar senha
    const senhaHash = await hashPassword(senha);

    return await clienteRepository.createCliente(
        nome,
        email,
        cpf,
        senhaHash
    );
}

export default {
    createCliente
};
