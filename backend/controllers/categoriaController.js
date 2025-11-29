import categoriaServices from "../services/categoriaServices.js";
import { AppError } from "../utils/error.js";

async function getAllCategorias(req, res) {
    try {
        const resultado = await categoriaServices.getAllCategorias();
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao buscar categorias.");
    }
}

async function getCategoria(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Informe o ID da categoria.");
        }

        const resultado = await categoriaServices.getCategoria(id);
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao buscar categoria.");
    }
}

async function createCategoria(req, res) {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).send("O nome da categoria é obrigatório.");
        }

        const resultado = await categoriaServices.createCategoria(nome);
        res.status(201).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao criar categoria.");
    }
}

async function updateCategoria(req, res) {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        if (!id || !nome) {
            return res.status(400).send("ID e nome são obrigatórios.");
        }

        const resultado = await categoriaServices.updateCategoria(id, nome);

        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao atualizar categoria.");
    }
}

async function deleteCategoria(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Informe o ID da categoria.");
        }

        const resultado = await categoriaServices.deleteCategoria(id);
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao excluir categoria.");
    }
}

export default {
    getAllCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria,
};
