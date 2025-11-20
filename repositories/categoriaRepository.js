import BD from "./bd.js";

async function getAllCategorias() {
    const conn = await BD.conectar();

    const sql = "SELECT id_categoria as id, nome FROM categorias ORDER BY id_categoria";

    try {
        const query = await conn.query(sql);
        return query.rows;
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getCategoria(id) {
    const conn = await BD.conectar();

    const sql = "SELECT id_categoria as id, nome FROM categorias WHERE id_categoria = $1";

    try {
        const query = await conn.query(sql, [id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function getCategoriaByNome(nome) {
    const conn = await BD.conectar();

    const sql = "SELECT id_categoria as id, nome FROM categorias WHERE LOWER(nome) = LOWER($1)";

    try {
        const query = await conn.query(sql, [nome]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function createCategoria(nome) {
    const conn = await BD.conectar();

    const sql = `
        INSERT INTO categorias (nome)
        VALUES ($1)
        RETURNING id_categoria as id, nome;
    `;

    try {
        const query = await conn.query(sql, [nome]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function updateCategoria(id, nome) {
    const conn = await BD.conectar();

    const sql = `
        UPDATE categorias
        SET nome = $1
        WHERE id_categoria = $2
        RETURNING id_categoria as id, nome;
    `;

    try {
        const query = await conn.query(sql, [nome, id]);
        return query.rows[0];
    } catch (err) {
        console.log(err);
    } finally {
        conn.release();
    }
}

async function deleteCategoria(id) {
    const conn = await BD.conectar();

    const sql = `
        DELETE FROM categorias
        WHERE id_categoria = $1
        RETURNING id_categoria as id, nome;
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
    getAllCategorias,
    getCategoria,
    getCategoriaByNome,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
