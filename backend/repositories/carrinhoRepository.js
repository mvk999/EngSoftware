// repositories/carrinhoRepository.js
import BD from "./bd.js";

/**
 * REGRAS CHAVE:
 * - Não armazenamos preço ou nome no carrinho (sempre pegar do produto)
 * - Repositório apenas devolve dados crus da tabela carrinho
 */

async function getCarrinho(clienteId, trx = null) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);  // Verificação adicional

  console.log("Buscando carrinho para o clienteId:", clienteId);  // Log de depuração

  const client = trx || (await BD.conectar());  // Conecta ao banco de dados
  const sql = `
    SELECT id_cliente, id_produto, quantidade
    FROM carrinho
    WHERE id_cliente = $1;
  `;
  try {
    const q = await client.query(sql, [clienteId]);  // Executa a consulta SQL
    console.log("Itens no carrinho:", q.rows);  // Log do resultado

    return q.rows;  // Retorna os resultados
  } catch (err) {
    console.error("Erro ao executar consulta:", err);  // Log de erro
    throw new AppError("Erro ao buscar carrinho.", 500);
  } finally {
    if (!trx) client.release();  // Libera a conexão, se não for uma transação
  }
}


async function getItem(clienteId, produtoId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM carrinho
    WHERE id_cliente = $1 AND id_produto = $2;
  `;
  try {
    const q = await client.query(sql, [clienteId, produtoId]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function adicionarItem(clienteId, produtoId, quantidade, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO carrinho (id_cliente, id_produto, quantidade)
    VALUES ($1, $2, $3)
    ON CONFLICT (id_cliente, id_produto)
    DO UPDATE SET quantidade = carrinho.quantidade + EXCLUDED.quantidade
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [clienteId, produtoId, quantidade]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function atualizarItem(clienteId, produtoId, quantidade, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE carrinho
    SET quantidade = $3
    WHERE id_cliente = $1 AND id_produto = $2
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [clienteId, produtoId, quantidade]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function removerItem(clienteId, produtoId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    DELETE FROM carrinho
    WHERE id_cliente = $1 AND id_produto = $2
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [clienteId, produtoId]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function limparCarrinho(clienteId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `DELETE FROM carrinho WHERE id_cliente = $1;`;
  try {
    await client.query(sql, [clienteId]);
    return true;
  } finally {
    if (!trx) client.release();
  }
}

export default {
  getCarrinho,
  getItem,
  adicionarItem,
  atualizarItem,
  removerItem,
  limparCarrinho
};
