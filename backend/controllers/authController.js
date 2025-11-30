// controllers/authController.js
import authServices from "../services/authServices.js";
import { AppError } from "../utils/error.js";

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ code: 400, message: "Email e senha são obrigatórios." });
    }

    // authServices.login deve retornar ao menos um token JWT
    const resultado = await authServices.login(email, senha);

    // Swagger define que a resposta tem um campo "token"
    // Se o service já retorna isso, só repassamos
    return res.status(200).json(resultado);
  } catch (err) {
    console.error("authController.login:", err);

    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json({ code: err.statusCode, message: err.message });
    }

    return res
      .status(500)
      .json({ code: 500, message: "Erro interno ao realizar login." });
  }
}

async function solicitarResetSenha(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ code: 400, message: "Email é obrigatório." });
    }

    await authServices.solicitarResetSenha(email);

    // Swagger: 200 "Token enviado ao email"
    return res
      .status(200)
      .json({ mensagem: "Link de redefinição enviado para o email informado." });
  } catch (err) {
    console.error("authController.solicitarResetSenha:", err);

    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json({ code: err.statusCode, message: err.message });
    }

    return res.status(500).json({
      code: 500,
      message: "Erro interno ao solicitar redefinição de senha.",
    });
  }
}

async function redefinirSenha(req, res) {
  try {
    // Swagger: token vem via path param, mas deixei fallback via body
    const token = req.params.token || req.body.token;
    const novaSenha = req.body.novaSenha || req.body.senha;

    if (!token) {
      return res
        .status(400)
        .json({ code: 400, message: "Token é obrigatório." });
    }

    if (!novaSenha) {
      return res
        .status(400)
        .json({ code: 400, message: "A nova senha é obrigatória." });
    }

    const msg = await authServices.redefinirSenha(token, novaSenha);

    // Swagger: 200 "Senha atualizada"
    return res.status(200).json({ mensagem: msg });
  } catch (err) {
    console.error("authController.redefinirSenha:", err);

    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json({ code: err.statusCode, message: err.message });
    }

    return res
      .status(500)
      .json({ code: 500, message: "Erro interno ao redefinir senha." });
  }
}

export default { login, solicitarResetSenha, redefinirSenha };
