import categoriaRepository from "../repositories/categoriaRepository.js";
import { AppError } from "../utils/error.js";

async function getAllCategorias() {
    return await categoriaRepository.getAllCategorias();
}

async function getCategoria(id) {
    const categoria = await categoriaRepository.getCategoria(id);

    if (!categoria) {
        throw new AppError("Categoria não encontrada.", 404);
    }

    return categoria;
}

async function createCategoria(nome) {
    // verificar se já existe categoria com esse nome
    const existente = await categoriaRepository.getCategoriaByNome(nome);

    if (existente) {
        throw new AppError("Já existe uma categoria com esse nome.", 400);
    }

    return await categoriaRepository.createCategoria(nome);
}

async function updateCategoria(id, nome) {
    const categoria = await categoriaRepository.getCategoria(id);

    if (!categoria) {
        throw new AppError("Categoria não encontrada.", 404);
    }

    // se usuário quiser mudar para um nome já existente → erro
    const nomeExiste = await categoriaRepository.getCategoriaByNome(nome);
    if (nomeExiste && nomeExiste.id !== Number(id)) {
        throw new AppError("Já existe categoria com esse nome.", 400);
    }

    return await categoriaRepository.updateCategoria(id, nome);
}

async function deleteCategoria(id) {
    const categoria = await categoriaRepository.getCategoria(id);

    if (!categoria) {
        throw new AppError("Categoria não encontrada.", 404);
    }

    return await categoriaRepository.deleteCategoria(id);
}

export default {
    getAllCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
