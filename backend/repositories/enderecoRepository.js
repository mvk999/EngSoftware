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

export default {
  criarEndereco,
  getEndereco
};
