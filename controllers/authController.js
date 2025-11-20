import authServices from "../services/authServices.js";
import { AppError } from "../utils/error.js";

async function login(req, res) {
    try {
        console.log("[authController] login called");
        console.log("[authController] body:", req.body);
        // pegar variáveis
        const { email, senha } = req.body;

        // validar variáveis
        if (!email || !senha) {
            return res.status(400).send("Email e senha são obrigatórios.");
        }

        // chamar service
        const resultado = await authServices.login(email, senha);

        // retornar resultado
        res.status(200).send(resultado);

    } catch (err) {
        console.error("[authController] error:", err && err.stack ? err.stack : err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro interno ao realizar login.");
    }
}

async function solicitarResetSenha(req, res) {
    try {
        // pegar variáveis
        const { email } = req.body;

        // validar
        if (!email) {
            return res.status(400).send("Email é obrigatório.");
        }

        // chamar service
        await authServices.solicitarResetSenha(email);

        res.status(200).send("Link de redefinição enviado para o email informado.");

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro interno ao solicitar redefinição de senha.");
    }
}

async function redefinirSenha(req, res) {
    try {
        // pegar variáveis
        const { token } = req.params;
        const novaSenha = req.body.novaSenha || req.body.senha;

        // validar
        if (!novaSenha) {
            return res.status(400).send("A nova senha é obrigatória.");
        }

        // chamar service
        await authServices.redefinirSenha(token, novaSenha);

        res.status(200).send("Senha redefinida com sucesso.");

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro interno ao redefinir senha.");
    }
}

export default {
    login,
    solicitarResetSenha,
    redefinirSenha
};
