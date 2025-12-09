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

async function getEnderecosByUsuario(idUsuario, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM enderecos
    WHERE id_usuario = $1
    ORDER BY id_endereco ASC;
  `;
  try {
    const q = await client.query(sql, [idUsuario]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}


async function atualizarEnderecoCompleto(idEndereco, dados, trx = null) {
  const client = trx || (await BD.conectar());

  const {
    rua = null,
    numero = null,
    bairro = null,
    cidade = null,
    estado = null,
    cep = null
  } = dados;

  const sql = `
    UPDATE enderecos
    SET 
      rua = COALESCE($1, rua),
      numero = COALESCE($2, numero),
      bairro = COALESCE($3, bairro),
      cidade = COALESCE($4, cidade),
      estado = COALESCE($5, estado),
      cep = COALESCE($6, cep)
    WHERE id_endereco = $7
    RETURNING *;
  `;

  try {
    const q = await client.query(sql, [
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      idEndereco
    ]);

    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}
async function atualizarEnderecoPorPedido(pedidoId, dados, trx = null) {
  const client = trx || (await BD.conectar());

  try {
    // 1) descobrir o ID do endereço associado ao pedido
    const sqlBusca = `
      SELECT endereco_id 
      FROM pedidos 
      WHERE id_pedido = $1
    `;
    const q1 = await client.query(sqlBusca, [pedidoId]);

    if (q1.rowCount === 0) return null;

    const idEndereco = q1.rows[0].endereco_id;


    return await atualizarEnderecoCompleto(idEndereco, dados, client);

  } finally {
    if (!trx) client.release();
  }
}


export default {
  criarEndereco,
  getEndereco,
  getEnderecosByUsuario,
  atualizarEnderecoCompleto,
   atualizarEnderecoPorPedido
};
