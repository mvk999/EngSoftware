import BD from "./bd.js";

async function getCliente(id) {
    const conn = await BD.conectar();

    const sql = "SELECT id_usuario as id, nome, email, cpf, senha FROM usuarios WHERE id_usuario = $1";

    try {
        const query = await conn.query(sql, [id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getClienteByEmail(email) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_usuario as id, nome, email, cpf, senha FROM usuarios
        WHERE LOWER(email) = LOWER($1)
    `;

    try {
        const query = await conn.query(sql, [email]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getClienteByCPF(cpf) {
    const conn = await BD.conectar();

    const sql = `
        SELECT id_usuario as id, nome, email, cpf, senha FROM usuarios
        WHERE cpf = $1
    `;

    try {
        const query = await conn.query(sql, [cpf]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function createCliente(nome, email, cpf, senhaHash) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO usuarios (nome, email, cpf, senha, tipo)
        VALUES ($1, $2, $3, $4, 'CLIENTE')
        RETURNING id_usuario as id, nome, email, cpf;
    `;

    try {
        const query = await conn.query(sql, [nome, email, cpf, senhaHash]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function updateCliente(id, nome, email, cpf, senhaHash) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE usuarios
        SET nome = $1,
            email = $2,
            cpf = $3,
            senha = $4
        WHERE id_usuario = $5
        RETURNING id_usuario as id, nome, email, cpf;
    `;

    try {
        const query = await conn.query(sql, [nome, email, cpf, senhaHash, id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function atualizarSenha(id, senhaHash) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE usuarios
        SET senha = $1
        WHERE id_usuario = $2;
    `;

    try {
        await conn.query(sql, [senhaHash, id]);
        return true;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function deleteCliente(id) {
    const conn = await BD.conectar();

    const sql = `
        DELETE FROM usuarios
        WHERE id_usuario = $1
        RETURNING id_usuario as id, nome, email, cpf;
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

export default {
    getCliente,
    getClienteByEmail,
    getClienteByCPF,
    createCliente,
    updateCliente,
    atualizarSenha,
    deleteCliente
};
