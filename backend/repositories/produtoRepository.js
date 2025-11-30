// repositories/produtoRepository.js
import BD from "./bd.js";

/**
 * Tabela: produtos
 * Campos relevantes:
 *  - id_produto
 *  - nome
 *  - preco
 *  - id_categoria
 *  - descricao
 *  - estoque
 */

// Lista geral com filtros opcionais
async function getProdutos(filtros = {}, trx = null) {
  const client = trx || (await BD.conectar());

  const {
    termo,
    categoriaId,
    precoMin,
    precoMax,
    ordenar
  } = filtros;

  const params = [];
  const wheres = [];

  if (termo) {
    params.push(`%${termo}%`);
    wheres.push(`LOWER(p.nome) LIKE LOWER($${params.length})`);
  }

  if (categoriaId) {
    params.push(Number(categoriaId));
    wheres.push(`p.id_categoria = $${params.length}`);
  }

  if (precoMin) {
    params.push(Number(precoMin));
    wheres.push(`p.preco >= $${params.length}`);
  }

  if (precoMax) {
    params.push(Number(precoMax));
    wheres.push(`p.preco <= $${params.length}`);
  }

  let orderBy = "p.nome";
  if (ordenar === "preco_asc") orderBy = "p.preco ASC";
  else if (ordenar === "preco_desc") orderBy = "p.preco DESC";

  const sql = `
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    JOIN categorias c ON c.id_categoria = p.id_categoria
    ${wheres.length ? "WHERE " + wheres.join(" AND ") : ""}
    ORDER BY ${orderBy};
  `;

  try {
    const q = await client.query(sql, params);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

async function getAllProdutos(trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    JOIN categorias c ON c.id_categoria = p.id_categoria
    ORDER BY p.id_produto;
  `;
  try {
    const q = await client.query(sql);
    return q.rows;
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

/**
 * Consulta usada para garantir unicidade de nome dentro da mesma categoria.
 */
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
  trx = null
) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO produtos (nome, preco, id_categoria, descricao, estoque)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  try {
    const q = await client.query(sql, [
      nome,
      preco,
      categoriaId,
      descricao || null,
      estoque ?? 0
    ]);
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
  trx = null
) {
  const client = trx || (await BD.conectar());

  const sql = `
    UPDATE produtos
    SET nome = COALESCE($1, nome),
        preco = COALESCE($2, preco),
        id_categoria = COALESCE($3, id_categoria),
        descricao = COALESCE($4, descricao),
        estoque = COALESCE($5, estoque)
    WHERE id_produto = $6
    RETURNING *;
  `;

  try {
    const q = await client.query(sql, [
      nome ?? null,
      preco ?? null,
      categoriaId ?? null,
      descricao ?? null,
      estoque ?? null,
      id
    ]);
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

async function buscarPorNome(termo, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    JOIN categorias c ON c.id_categoria = p.id_categoria
    WHERE LOWER(p.nome) LIKE LOWER('%' || $1 || '%')
    ORDER BY p.nome;
  `;
  try {
    const q = await client.query(sql, [termo]);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

export default {
  getProdutos,
  getAllProdutos,
  getProduto,
  getProdutoByNomeECategoria,
  createProduto,
  updateProduto,
  deleteProduto,
  diminuirEstoque,
  aumentarEstoque,
  buscarPorNome
};
