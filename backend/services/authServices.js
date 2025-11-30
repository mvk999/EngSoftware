// services/authServices.js
import authRepository from "../repositories/authRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken, validateToken } from "../utils/jwt.js";
import { enviarEmailResetSenha } from "../utils/email.js";

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MINUTOS = 15;

const RESET_TOKEN_EXPIRACAO =
  process.env.RESET_TOKEN_EXPIRES_IN || "1h";

async function login(email, senha) {
  if (!email || !senha) {
    throw new AppError("Email e senha são obrigatórios.", 400);
  }

  // 🔥 Agora buscamos QUALQUER usuário (CLIENTE ou ADMIN)
  const usuario = await clienteRepository.getUsuarioByEmail(email);
  if (!usuario) throw new AppError("Email não encontrado.", 404);

  // 🔥 Corrigido: campo certo é "bloqueado_ate"
  const bloqueio = await authRepository.getBloqueioPorEmail(email);

  if (bloqueio?.bloqueado_ate && new Date(bloqueio.bloqueado_ate) > new Date()) {
    const minutos = Math.ceil(
      (new Date(bloqueio.bloqueado_ate) - new Date()) / 60000
    );

    throw new AppError(
      `Conta bloqueada por tentativas excessivas. Tente novamente em ${minutos} minuto(s).`,
      403
    );
  }

  const senhaCorreta = await comparePassword(senha, usuario.senha);

  if (!senhaCorreta) {
    await authRepository.incrementarTentativaFalha(email);

    const tentativas = await authRepository.getTentativasFalhas(email);

    if (tentativas >= MAX_TENTATIVAS) {
      const desbloqueiaEm = new Date(
        Date.now() + BLOQUEIO_MINUTOS * 60000
      );

      await authRepository.bloquearContaPorEmail(email, desbloqueiaEm);
      await authRepository.resetarTentativasFalhas(email);

      throw new AppError(
        `Conta bloqueada por ${BLOQUEIO_MINUTOS} minutos devido a várias tentativas inválidas.`,
        403
      );
    }

    throw new AppError("Senha incorreta.", 401);
  }

  await authRepository.resetarTentativasFalhas(email);
  await authRepository.removerBloqueio(email);

  const token = generateToken({
    id: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo
  });

  return {
    mensagem: "Login realizado com sucesso.",
    token
  };
}

async function solicitarResetSenha(email) {
  if (!email) throw new AppError("Email é obrigatório.", 400);

  // 🔥 Também passa a aceitar admin aqui, se quiser resetar senha dele
  const usuario = await clienteRepository.getUsuarioByEmail(email);
  if (!usuario) throw new AppError("Email não encontrado.", 404);

  const token = generateToken(
    { id: usuario.id_usuario },
    RESET_TOKEN_EXPIRACAO
  );

  await authRepository.salvarTokenReset(
    usuario.id_usuario,
    token,
    RESET_TOKEN_EXPIRACAO
  );

  const baseUrl =
    process.env.APP_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000";

  const link = `${baseUrl}/auth/reset/${token}`;

  await enviarEmailResetSenha(email, link);

  return true;
}

async function redefinirSenha(token, novaSenha) {
  if (!token) throw new AppError("Token é obrigatório.", 400);

  if (!novaSenha)
    throw new AppError("A nova senha é obrigatória.", 400);

  if (novaSenha.length < 6)
    throw new AppError("A senha deve conter pelo menos 6 caracteres.", 400);

  let dados;
  try {
    dados = validateToken(token);
  } catch {
    throw new AppError("Token inválido ou expirado.", 401);
  }

  const clienteId = dados?.id;
  if (!clienteId)
    throw new AppError("Token inválido ou expirado.", 401);

  const tokenValido = await authRepository.validarTokenReset(clienteId, token);

  if (!tokenValido)
    throw new AppError("Token inválido ou já utilizado.", 401);

  const senhaHash = await hashPassword(novaSenha);

  await clienteRepository.atualizarSenha(clienteId, senhaHash);
  await authRepository.invalidarTokenReset(clienteId, token);

  return "Senha redefinida com sucesso.";
}

export default {
  login,
  solicitarResetSenha,
  redefinirSenha
};
