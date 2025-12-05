process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app.js";
import db from "../repositories/bd.js";
import categoriaRepository from "../repositories/categoriaRepository.js";

beforeAll(async () => {
    await db.initDB();
});

afterAll(async () => {
    await db.pool.end();
});

beforeEach(async () => {
    await db.pool.query("DELETE FROM carrinho;");
    await db.pool.query("DELETE FROM produtos;");
    await db.pool.query("DELETE FROM categorias;");
});

describe("testes completos de categoria", () => {

    test("Cria categoria", async () => {
        const res = await request(app)
            .post("/categoria")
            .set("Authorization", "Bearer fakeAdmin")
            .send({ nome: "Tecnologia" });

        expect(res.status).toBe(201);
        expect(res.body.nome).toBe("Tecnologia");
    });

    test("Lista categorias", async () => {
        await categoriaRepository.createCategoria("Periféricos");

        const res = await request(app).get("/categoria");

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("Busca categoria por ID", async () => {
        const categoria = await categoriaRepository.createCategoria("Acessórios");

        const res = await request(app).get(`/categoria/${categoria.id_categoria}`);

        expect(res.status).toBe(200);
        expect(res.body.nome).toBe("Acessórios");
    });

    test("Atualiza categoria", async () => {
        const cat = await categoriaRepository.createCategoria("Antigo");

        const res = await request(app)
            .put(`/categoria/${cat.id_categoria}`)
            .set("Authorization", "Bearer fakeAdmin")
            .send({ nome: "Novo" });

        expect(res.status).toBe(200);
        expect(res.body.nome).toBe("Novo");
    });

    test("Deleta categoria", async () => {
        const cat = await categoriaRepository.createCategoria("DeleteMe");

        const res = await request(app)
            .delete(`/categoria/${cat.id_categoria}`)
            .set("Authorization", "Bearer fakeAdmin");

        expect(res.status).toBe(200);
    });
});
