import authRepository from "../repositories/authRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";
import { comparePassword } from "../utils/password.js";
import { generateToken, validateToken } from "../utils/jwt.js";
import { hashPassword } from "../utils/password.js";

async function login(email, senha) {
    // validar se email existe
    const cliente = await clienteRepository.getClienteByEmail(email);

    if (!cliente) {
        throw new AppError("Email não encontrado.", 404);
    }

    // validar senha
    const senhaCorreta = await comparePassword(senha, cliente.senha);
    if (!senhaCorreta) {
        throw new AppError("Senha incorreta.", 401);
    }

    // gerar token JWT
    const token = generateToken({
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email
    });

    return {
        mensagem: "Login realizado com sucesso.",
        token,
        cliente: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf
        }
    };
}

async function solicitarResetSenha(email) {
    const cliente = await clienteRepository.getClienteByEmail(email);

    if (!cliente) {
        throw new AppError("Email não encontrado.", 404);
    }

    // gerar token temporário
    const token = generateToken({ id: cliente.id }, "1h");

    // salvar token no banco
    await authRepository.salvarTokenReset(cliente.id, token);

    return token;
}

async function redefinirSenha(token, novaSenha) {
    // validar token
    const dados = validateToken(token);

    if (!dados || !dados.id) {
        throw new AppError("Token inválido ou expirado.", 401);
    }

    // validar se token existe na tabela
    const valido = await authRepository.validarTokenReset(dados.id, token);

    if (!valido) {
        throw new AppError("Token inválido ou já utilizado.", 401);
    }

    // gerar senha criptografada
    const senhaHash = await hashPassword(novaSenha);

    // atualizar senha
    await clienteRepository.atualizarSenha(dados.id, senhaHash);

    // invalidar token
    await authRepository.invalidarTokenReset(dados.id, token);

    return "Senha redefinida com sucesso.";
}

export default {
    login,
    solicitarResetSenha,
    redefinirSenha
};
