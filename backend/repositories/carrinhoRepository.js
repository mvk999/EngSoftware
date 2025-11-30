import BD from "./bd.js";

async function getCarrinho(clienteId) {
    const conn = await BD.conectar();

    const sql = `
        SELECT c.id_carrinho as id, c.id_cliente as cliente_id, c.id_produto as produto_id, c.quantidade, p.nome AS produto_nome, p.preco
        FROM carrinho c
        JOIN produtos p ON p.id_produto = c.id_produto
        WHERE c.id_cliente = $1;
    `;

    try {
        const query = await conn.query(sql, [clienteId]);
        return query.rows;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getItem(clienteId, produtoId) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_carrinho as id, id_cliente as cliente_id, id_produto as produto_id, quantidade FROM carrinho
        WHERE id_cliente = $1 AND id_produto = $2;
    `;

    try {
        const query = await conn.query(sql, [clienteId, produtoId]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function adicionarItem(clienteId, produtoId, quantidade) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO carrinho (id_cliente, id_produto, quantidade)
        VALUES ($1, $2, $3)
        RETURNING id_carrinho as id, id_cliente as cliente_id, id_produto as produto_id, quantidade;
    `;

    try {
        const query = await conn.query(sql, [clienteId, produtoId, quantidade]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function atualizarItem(clienteId, produtoId, quantidade) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE carrinho
        SET quantidade = $3
        WHERE id_cliente = $1 AND id_produto = $2
        RETURNING id_carrinho as id, id_cliente as cliente_id, id_produto as produto_id, quantidade;
    `;

    try {
        const query = await conn.query(sql, [clienteId, produtoId, quantidade]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function removerItem(clienteId, produtoId) {
    const conn = await BD.conectar();

    const sql = `
        DELETE FROM carrinho
        WHERE id_cliente = $1 AND id_produto = $2
        RETURNING id_carrinho as id, id_cliente as cliente_id, id_produto as produto_id, quantidade;
    `;

    try {
        const query = await conn.query(sql, [clienteId, produtoId]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function limparCarrinho(clienteId) {
    const conn = await BD.conectar();

    const sql = `
        DELETE FROM carrinho
        WHERE id_cliente = $1;
    `;

    try {
        await conn.query(sql, [clienteId]);
        return true;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
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
