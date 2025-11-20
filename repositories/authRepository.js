import BD from "./bd.js";

async function salvarTokenReset(clienteId, token) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO tokens_reset (id_usuario, token, data_expiracao)
        VALUES ($1, $2, NOW() + interval '1 hour')
        ON CONFLICT (id_usuario)
        DO UPDATE SET token = $2, data_expiracao = NOW() + interval '1 hour'
        RETURNING *;
    `;

    try {
        const query = await conn.query(sql, [clienteId, token]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function validarTokenReset(clienteId, token) {
    const conn = await BD.conectar();

    const sql = `
        SELECT * FROM tokens_reset
        WHERE id_usuario = $1 AND token = $2 AND data_expiracao > NOW();
    `;

    try {
        const query = await conn.query(sql, [clienteId, token]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function invalidarTokenReset(clienteId, token) {
    const conn = await BD.conectar();

    const sql = `
        DELETE FROM tokens_reset
        WHERE id_usuario = $1 AND token = $2;
    `;

    try {
        await conn.query(sql, [clienteId, token]);
        return true;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

export default {
    salvarTokenReset,
    validarTokenReset,
    invalidarTokenReset
};
