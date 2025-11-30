// repositories/authRepository.js
import BD from "./bd.js";

/**
 * Repositório responsável por:
 * - Tokens de reset (tokens_reset)
 * - Tentativas de login e bloqueio temporário (auth_failures)
 */

async function ensureAuthFailuresTable() {
  const conn = await BD.conectar();
  const sql = `
    CREATE TABLE IF NOT EXISTS auth_failures (
      email VARCHAR(100) UNIQUE NOT NULL,
      tentativas INTEGER NOT NULL DEFAULT 0,
      bloqueado_ate TIMESTAMP NULL
    );
  `;
  try {
    await conn.query(sql);
  } finally {
    conn.release();
  }
}

// garantir tabela ao carregar o módulo
await ensureAuthFailuresTable();

/* ---------------------- Tokens de reset ---------------------- */

async function salvarTokenReset(idUsuario, tokenHash, expiresIn) {
  const conn = await BD.conectar();

  let sqlExp = `NOW() + INTERVAL '1 hour'`;

  if (typeof expiresIn === "string") {
    if (expiresIn.endsWith("h")) {
      const h = Number(expiresIn.replace("h", "")) || 1;
      sqlExp = `NOW() + INTERVAL '${h} hour'`;
    } else if (expiresIn.endsWith("m")) {
      const m = Number(expiresIn.replace("m", "")) || 60;
      sqlExp = `NOW() + INTERVAL '${m} minute'`;
    }
  }

  const sql = `
    INSERT INTO tokens_reset (id_usuario, token_hash, data_expiracao)
    VALUES ($1, $2, ${sqlExp})
    ON CONFLICT (id_usuario)
    DO UPDATE SET token_hash = EXCLUDED.token_hash, data_expiracao = ${sqlExp}
    RETURNING *;
  `;

  try {
    const q = await conn.query(sql, [idUsuario, tokenHash]);
    return q.rows[0];
  } finally {
    conn.release();
  }
}

async function validarTokenReset(idUsuario, tokenHash) {
  const conn = await BD.conectar();
  const sql = `
    SELECT *
    FROM tokens_reset
    WHERE id_usuario = $1
      AND token_hash = $2
      AND data_expiracao > NOW();
  `;
  try {
    const q = await conn.query(sql, [idUsuario, tokenHash]);
    return q.rows[0] || null;
  } finally {
    conn.release();
  }
}

async function invalidarTokenReset(idUsuario, tokenHash) {
  const conn = await BD.conectar();
  const sql = `
    DELETE FROM tokens_reset
    WHERE id_usuario = $1 AND token_hash = $2;
  `;
  try {
    await conn.query(sql, [idUsuario, tokenHash]);
    return true;
  } finally {
    conn.release();
  }
}

/* ---------------------- Tentativas e bloqueio ---------------------- */

async function getBloqueioPorEmail(email) {
  const conn = await BD.conectar();
  const sql = `
    SELECT email, tentativas, bloqueado_ate
    FROM auth_failures
    WHERE LOWER(email) = LOWER($1)
  `;
  try {
    const q = await conn.query(sql, [email]);
    return q.rows[0] || null;
  } finally {
    conn.release();
  }
}

async function incrementarTentativaFalha(email) {
  const conn = await BD.conectar();
  const sql = `
    INSERT INTO auth_failures (email, tentativas)
    VALUES (LOWER($1), 1)
    ON CONFLICT (email)
      DO UPDATE SET tentativas = auth_failures.tentativas + 1
    RETURNING tentativas;
  `;
  try {
    const q = await conn.query(sql, [email]);
    return q.rows[0].tentativas;
  } finally {
    conn.release();
  }
}

async function getTentativasFalhas(email) {
  const registro = await getBloqueioPorEmail(email);
  return registro ? Number(registro.tentativas) : 0;
}

async function bloquearContaPorEmail(email, unblockDate) {
  const conn = await BD.conectar();
  const sql = `
    INSERT INTO auth_failures (email, tentativas, bloqueado_ate)
    VALUES (LOWER($1), 0, $2)
    ON CONFLICT (email)
      DO UPDATE SET tentativas = 0, bloqueado_ate = $2
    RETURNING *;
  `;
  try {
    const q = await conn.query(sql, [email, unblockDate]);
    return q.rows[0];
  } finally {
    conn.release();
  }
}

async function resetarTentativasFalhas(email) {
  const conn = await BD.conectar();
  const sql = `
    UPDATE auth_failures
    SET tentativas = 0, bloqueado_ate = NULL
    WHERE LOWER(email) = LOWER($1)
    RETURNING *;
  `;
  try {
    const q = await conn.query(sql, [email]);
    return q.rows[0] || null;
  } finally {
    conn.release();
  }
}

async function removerBloqueio(email) {
  const conn = await BD.conectar();
  const sql = `
    UPDATE auth_failures
    SET bloqueado_ate = NULL
    WHERE LOWER(email) = LOWER($1)
    RETURNING *;
  `;
  try {
    const q = await conn.query(sql, [email]);
    return q.rows[0] || null;
  } finally {
    conn.release();
  }
}

export default {
  salvarTokenReset,
  validarTokenReset,
  invalidarTokenReset,
  getBloqueioPorEmail,
  incrementarTentativaFalha,
  getTentativasFalhas,
  bloquearContaPorEmail,
  resetarTentativasFalhas,
  removerBloqueio
};
