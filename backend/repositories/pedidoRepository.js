// repositories/pedidoRepository.js
import BD from "./bd.js";

/**
 * Repositório do módulo Pedidos.
 * Tabelas:
 *  - pedidos(id_pedido, id_cliente, status, data_criacao, valor_total)
 *  - itens_pedido(id_pedido, id_produto, quantidade, preco_unitario)
 */

async function getAllPedidos(trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM pedidos
    ORDER BY id_pedido DESC;
  `;
  try {
    const q = await client.query(sql);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

async function getPedido(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM pedidos
    WHERE id_pedido = $1;
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function getPedidosByCliente(clienteId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM pedidos
    WHERE id_cliente = $1
    ORDER BY id_pedido DESC;
  `;
  try {
    const q = await client.query(sql, [clienteId]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

/**
 * AGORA correto:
 * criarPedido(clienteId, valorTotal, trx)
 */
async function criarPedido(clienteId, valorTotal, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO pedidos (id_cliente, status, valor_total)
    VALUES ($1, 'pendente', $2)
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [clienteId, valorTotal]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function adicionarItemNoPedido(pedidoId, produtoId, quantidade, precoUnitario, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [
      pedidoId,
      produtoId,
      quantidade,
      precoUnitario
    ]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function getItensPedido(pedidoId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM itens_pedido
    WHERE id_pedido = $1;
  `;
  try {
    const q = await client.query(sql, [pedidoId]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

async function atualizarStatus(idPedido, novoStatus, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE pedidos
    SET status = $1
    WHERE id_pedido = $2
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [novoStatus, idPedido]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function transaction(cb) {
  return BD.transaction(cb);
}

export default {
  getAllPedidos,
  getPedido,
  getPedidosByCliente,
  criarPedido,
  adicionarItemNoPedido,
  getItensPedido,
  atualizarStatus,
  transaction
};
