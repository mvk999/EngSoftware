import BD from "./bd.js";

async function getAllProdutos() {
    const conn = await BD.conectar();

    const sql = `
        SELECT p.id_produto as id, p.nome, p.descricao, p.preco, p.estoque, c.nome AS categoria_nome, p.id_categoria as categoria_id
        FROM produtos p
        LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
        ORDER BY p.id_produto;
    `;

    try {
        const query = await conn.query(sql);
        return query.rows;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getProduto(id) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id FROM produtos
        WHERE id_produto = $1;
    `;

    try {
        const query = await conn.query(sql, [id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getProdutoByNomeECategoria(nome, categoriaId) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id FROM produtos
        WHERE LOWER(nome) = LOWER($1) AND id_categoria = $2;
    `;

    try {
        const query = await conn.query(sql, [nome, categoriaId]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function createProduto(nome, preco, categoriaId, descricao, estoque) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO produtos (nome, preco, id_categoria, descricao, estoque)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id;
    `;

    try {
        const query = await conn.query(sql, [
            nome,
            preco,
            categoriaId,
            descricao || null,
            estoque || 0
        ]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function updateProduto(id, nome, preco, categoriaId, descricao, estoque) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE produtos
        SET 
            nome = $1,
            preco = $2,
            id_categoria = $3,
            descricao = $4,
            estoque = $5
        WHERE id_produto = $6
        RETURNING id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id;
    `;

    try {
        const query = await conn.query(sql, [
            nome,
            preco,
            categoriaId,
            descricao,
            estoque,
            id
        ]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function deleteProduto(id) {
    const conn = await BD.conectar();

    const sql = `
        DELETE FROM produtos
        WHERE id_produto = $1
        RETURNING id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id;
    `;

    try {
        const query = await conn.query(sql, [id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function diminuirEstoque(produtoId, quantidade) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE produtos
        SET estoque = estoque - $2
        WHERE id_produto = $1
        RETURNING id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id;
    `;

    try {
        const query = await conn.query(sql, [produtoId, quantidade]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function aumentarEstoque(produtoId, quantidade) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE produtos
        SET estoque = estoque + $2
        WHERE id_produto = $1
        RETURNING id_produto as id, nome, descricao, preco, estoque, id_categoria as categoria_id;
    `;

    try {
        const query = await conn.query(sql, [produtoId, quantidade]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

export default {
    getAllProdutos,
    getProduto,
    getProdutoByNomeECategoria,
    createProduto,
    updateProduto,
    deleteProduto,
    diminuirEstoque,
    aumentarEstoque
};
