// repositories/categoriaRepository.js
import BD from "./bd.js";

async function getAllCategorias(trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_categoria, nome
    FROM categorias
    ORDER BY nome;
  `;
  try {
    const q = await client.query(sql);
    return q.rows;
  } finally {
    if (!trx) client.release();
  }
}

async function getCategoria(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_categoria, nome
    FROM categorias
    WHERE id_categoria = $1;
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function getCategoriaByNome(nome, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    SELECT id_categoria, nome
    FROM categorias
    WHERE LOWER(nome) = LOWER($1);
  `;
  try {
    const q = await client.query(sql, [nome]);
    return q.rows[0] || null;
  } finally {
    if (!trx) client.release();
  }
}

async function createCategoria(nome, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    INSERT INTO categorias (nome)
    VALUES ($1)
    RETURNING id_categoria, nome;
  `;
  try {
    const q = await client.query(sql, [nome]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function updateCategoria(id, nome, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    UPDATE categorias
    SET nome = $1
    WHERE id_categoria = $2
    RETURNING id_categoria, nome;
  `;
  try {
    const q = await client.query(sql, [nome, id]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

async function deleteCategoria(id, trx = null) {
  const client = trx || (await BD.conectar());
  const sql = `
    DELETE FROM categorias
    WHERE id_categoria = $1
    RETURNING id_categoria, nome;
  `;
  try {
    const q = await client.query(sql, [id]);
    return q.rows[0];
  } finally {
    if (!trx) client.release();
  }
}

export default {
  getAllCategorias,
  getCategoria,
  getCategoriaByNome,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
