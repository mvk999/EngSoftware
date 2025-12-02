// repositories/produtoRepository.js
import BD from "./bd.js";

/**
 * Funções para manipulação do estoque de produtos.
 */

async function diminuirEstoque(produtoId, quantidade, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE produtos
    SET estoque = estoque - $2
    WHERE id_produto = $1
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [produtoId, quantidade]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function aumentarEstoque(produtoId, quantidade, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE produtos
    SET estoque = estoque + $2
    WHERE id_produto = $1
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [produtoId, quantidade]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function getProduto(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM produtos
    WHERE id_produto = $1;
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function getProdutos(trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM produtos
    ORDER BY id_produto;
  `;
  try {
    const q = await client.query(sql);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

async function getProdutosByCategoria(categoriaId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM produtos
    WHERE id_categoria = $1
    ORDER BY id_produto;
  `;
  try {
    const q = await client.query(sql, [categoriaId]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

async function getProdutoByNomeECategoria(nome, categoriaId, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT *
    FROM produtos
    WHERE LOWER(nome) = LOWER($1)
      AND id_categoria = $2;
  `;
  try {
    const q = await client.query(sql, [nome, categoriaId]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function createProduto(
  nome,
  preco,
  categoriaId,
  descricao,
  estoque,
  imagem,
  trx = null
) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO produtos (nome, preco, id_categoria, descricao, estoque, imagem)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const params = [nome, preco, categoriaId, descricao || null, estoque ?? 0, imagem];
  try {
    const q = await client.query(sql, params);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function updateProduto(
  id,
  nome,
  preco,
  categoriaId,
  descricao,
  estoque,
  imagem,
  trx = null
) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE produtos
    SET nome = COALESCE($1, nome),
        preco = COALESCE($2, preco),
        id_categoria = COALESCE($3, id_categoria),
        descricao = COALESCE($4, descricao),
        estoque = COALESCE($5, estoque),
        imagem = COALESCE($6, imagem)
    WHERE id_produto = $7
    RETURNING *;
  `;
  const params = [
    nome ?? null,
    preco ?? null,
    categoriaId ?? null,
    descricao ?? null,
    estoque ?? null,
    imagem ?? null,
    id
  ];
  try {
    const q = await client.query(sql, params);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function deleteProduto(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    DELETE FROM produtos
    WHERE id_produto = $1
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

export default {
  getProduto,
  getProdutos,
  getProdutosByCategoria,
  getProdutoByNomeECategoria,
  createProduto,
  updateProduto,
  deleteProduto,
  diminuirEstoque,
  aumentarEstoque
};
