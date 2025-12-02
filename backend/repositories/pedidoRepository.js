import BD from "./bd.js";
import produtoRepository from "./produtoRepository.js";

// =========================
// Listar todos os pedidos
// =========================
async function getAllPedidos(trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `SELECT * FROM pedidos ORDER BY id_pedido DESC;`;
  try {
    const q = await client.query(sql);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Pedido por ID
// =========================
async function getPedido(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `SELECT * FROM pedidos WHERE id_pedido = $1;`;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Pedidos de um cliente
// =========================
async function getPedidosByCliente(clienteId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT * FROM pedidos
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

// =========================
// Criar pedido
// =========================
async function criarPedido(clienteId, valorTotal, enderecoId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO pedidos (id_cliente, status, valor_total, endereco_id)
    VALUES ($1, 'pendente', $2, $3)
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [clienteId, valorTotal, enderecoId]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Adicionar item no pedido
// =========================
async function adicionarItemNoPedido(pedidoId, produtoId, quantidade, precoUnitario, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [pedidoId, produtoId, quantidade, precoUnitario]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Atualizar item do pedido
// =========================
async function atualizarItemPedido(pedidoId, produtoId, quantidade, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE itens_pedido
    SET quantidade = $1
    WHERE id_pedido = $2 AND id_produto = $3
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [quantidade, pedidoId, produtoId]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Buscar itens de um pedido
// =========================
async function getItensPedido(pedidoId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `SELECT * FROM itens_pedido WHERE id_pedido = $1;`;
  try {
    const q = await client.query(sql, [pedidoId]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Atualizar status do pedido
// =========================
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

// =========================
// Deletar pedido (cascata + repor estoque)
// =========================
async function deletarPedido(idPedido, trx = null) {
  const client = trx || (await BD.conectar());

  const itens = await getItensPedido(idPedido, trx);

  // Restaurar estoque
  for (let item of itens) {
    await produtoRepository.aumentarEstoque(item.id_produto, item.quantidade, trx);
  }

  const sql = `DELETE FROM pedidos WHERE id_pedido = $1 RETURNING *;`;
  try {
    const q = await client.query(sql, [idPedido]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

// =========================
// Transações
// =========================
async function transaction(cb) {
  return BD.transaction(cb);
}

export default {
  getAllPedidos,
  getPedido,
  getPedidosByCliente,
  criarPedido,
  adicionarItemNoPedido,
  atualizarItemPedido,
  getItensPedido,
  atualizarStatus,
  deletarPedido,
  transaction
};