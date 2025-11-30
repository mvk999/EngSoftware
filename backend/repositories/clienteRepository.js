// repositories/clienteRepository.js
import BD from "./bd.js";

/**
 * Repositório responsável por operações com usuários.
 * Inclui:
 *  - Funções específicas para CLIENTE
 *  - getUsuarioByEmail() → usado pelo login (CLIENTE ou ADMIN)
 */

/* ============================================================
   BUSCA QUALQUER USUÁRIO (CLIENTE OU ADMIN)
============================================================ */
async function getUsuarioByEmail(email, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_usuario, nome, email, cpf, senha, tipo
    FROM usuarios
    WHERE LOWER(email) = LOWER($1)
  `;
  try {
    const q = await client.query(sql, [email]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

/* ============================================================
   FUNÇÕES EXCLUSIVAS PARA CLIENTES
============================================================ */

async function getCliente(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_usuario, nome, email, cpf, senha, tipo
    FROM usuarios
    WHERE id_usuario = $1
      AND tipo = 'CLIENTE';
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function getClienteByEmail(email, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_usuario, nome, email, cpf, senha, tipo
    FROM usuarios
    WHERE LOWER(email) = LOWER($1)
      AND tipo = 'CLIENTE';
  `;
  try {
    const q = await client.query(sql, [email]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function getClienteByCPF(cpf, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_usuario, nome, email, cpf, senha, tipo
    FROM usuarios
    WHERE cpf = $1
      AND tipo = 'CLIENTE';
  `;
  try {
    const q = await client.query(sql, [cpf]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function createCliente(nome, email, cpf, senhaHash, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO usuarios (nome, email, cpf, senha, tipo)
    VALUES ($1, $2, $3, $4, 'CLIENTE')
    RETURNING id_usuario, nome, email, cpf, tipo;
  `;
  try {
    const q = await client.query(sql, [nome, email, cpf, senhaHash]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function updateCliente(id, nome, email, cpf, senhaHash, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE usuarios
    SET nome = $1,
        email = $2,
        cpf = $3,
        senha = $4
    WHERE id_usuario = $5
      AND tipo = 'CLIENTE'
    RETURNING id_usuario, nome, email, cpf, tipo;
  `;
  try {
    const q = await client.query(sql, [
      nome,
      email,
      cpf,
      senhaHash,
      id
    ]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function atualizarSenha(id, senhaHash, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE usuarios
    SET senha = $1
    WHERE id_usuario = $2
      AND tipo = 'CLIENTE';
  `;
  try {
    await client.query(sql, [senhaHash, id]);
    return true;
  } finally {
    if (!trx) client.release();
  }
}

async function deleteCliente(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    DELETE FROM usuarios
    WHERE id_usuario = $1
      AND tipo = 'CLIENTE'
    RETURNING id_usuario;
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

/* ============================================================
   EXPORTAÇÃO
============================================================ */
export default {
  getUsuarioByEmail,
  getCliente,
  getClienteByEmail,
  getClienteByCPF,
  createCliente,
  updateCliente,
  atualizarSenha,
  deleteCliente
};
