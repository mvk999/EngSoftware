import BD from "./bd.js";

async function getAllPedidos() {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_pedido as id, id_cliente as cliente_id, id_endereco as endereco_id, data_pedido as criado_em, status, valor_total
        FROM pedidos
        ORDER BY id_pedido DESC;
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

async function getPedido(id) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_pedido as id, id_cliente as cliente_id, id_endereco as endereco_id, data_pedido as criado_em, status, valor_total
        FROM pedidos
        WHERE id_pedido = $1;
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

async function criarPedido(clienteId) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO pedidos (id_cliente, status, data_pedido, valor_total)
        VALUES ($1, 'pendente', NOW(), 0)
        RETURNING id_pedido as id, id_cliente as cliente_id, id_endereco as endereco_id, data_pedido as criado_em, status, valor_total;
    `;

    try {
        const query = await conn.query(sql, [clienteId]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function adicionarItemNoPedido(pedidoId, produtoId, quantidade, precoUnitario) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_unitario)
        VALUES ($1, $2, $3, $4)
        RETURNING id_item as id, id_pedido as pedido_id, id_produto as produto_id, quantidade, preco_unitario;
    `;

    try {
        const query = await conn.query(sql, [
            pedidoId,
            produtoId,
            quantidade,
            precoUnitario
        ]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getItensPedido(pedidoId) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_item as id, id_pedido as pedido_id, id_produto as produto_id, quantidade, preco_unitario
        FROM itens_pedido
        WHERE id_pedido = $1;
    `;

    try {
        const query = await conn.query(sql, [pedidoId]);
        return query.rows;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function atualizarStatus(id, novoStatus) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE pedidos
        SET status = $1
        WHERE id_pedido = $2
        RETURNING id_pedido as id, id_cliente as cliente_id, id_endereco as endereco_id, data_pedido as criado_em, status, valor_total;
    `;

    try {
        const query = await conn.query(sql, [novoStatus, id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

export default {
    getAllPedidos,
    getPedido,
    criarPedido,
    adicionarItemNoPedido,
    getItensPedido,
    atualizarStatus
};
