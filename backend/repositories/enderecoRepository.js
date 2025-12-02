// repositories/enderecoRepository.js
import BD from "./bd.js";

async function criarEndereco(idUsuario, rua, numero, bairro, cidade, estado, cep, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO enderecos (id_usuario, rua, numero, bairro, cidade, estado, cep)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [
      idUsuario, rua, numero, bairro, cidade, estado, cep
    ]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function getEndereco(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `SELECT * FROM enderecos WHERE id_endereco = $1;`;

  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function atualizarEndereco(id, rua, numero, bairro, cidade, estado, cep, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE enderecos
    SET rua = $1, numero = $2, bairro = $3, cidade = $4, estado = $5, cep = $6
    WHERE id_endereco = $7
    RETURNING *;
  `;

  try {
    const q = await client.query(sql, [
      rua, numero, bairro, cidade, estado, cep, id
    ]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function getEnderecosByUsuario(idUsuario, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `SELECT * FROM enderecos WHERE id_usuario = $1;`;

  try {
    const q = await client.query(sql, [idUsuario]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

export default {
  criarEndereco,
  getEndereco,
  atualizarEndereco,
  getEnderecosByUsuario
};
