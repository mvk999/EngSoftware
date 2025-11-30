import produtoRepository from "../repositories/produtoRepository.js";
import categoriaRepository from "../repositories/categoriaRepository.js";
import { AppError } from "../utils/error.js";

async function getAllProdutos() {
    return await produtoRepository.getAllProdutos();
}
async function createProduto(nome, preco, categoriaId, descricao, estoque) {
    // validar categoria
    const categoria = await categoriaRepository.getCategoria(categoriaId);

    if (!categoria) {
        throw new AppError("Categoria não encontrada.", 404);
    }

    if (preco <= 0) {
        throw new AppError("Preço deve ser maior que zero.", 400);
    }

    if (estoque < 0) {
        throw new AppError("Estoque não pode ser negativo.", 400);
    }

    // evitar produtos duplicados na mesma categoria
    const existente = await produtoRepository.getProdutoByNomeECategoria(nome, categoriaId);
    if (existente) {
        throw new AppError("Já existe um produto com esse nome nesta categoria.", 400);
    }

    return await produtoRepository.createProduto(
        nome,
        preco,
        categoriaId,
        descricao,
        estoque
    );
}

async function updateProduto(id, nome, preco, categoriaId, descricao, estoque) {
    const produto = await produtoRepository.getProduto(id);

    if (!produto) {
        throw new AppError("Produto não encontrado.", 404);
    }

    if (categoriaId) {
        const categoria = await categoriaRepository.getCategoria(categoriaId);

        if (!categoria) {
            throw new AppError("Categoria não encontrada.", 404);
        }
    }

    if (preco !== undefined && preco <= 0) {
        throw new AppError("Preço deve ser maior que zero.", 400);
    }

    if (estoque !== undefined && estoque < 0) {
        throw new AppError("Estoque não pode ser negativo.", 400);
    }

    // evitar duplicidade
    const duplicado = await produtoRepository.getProdutoByNomeECategoria(nome, categoriaId);
    if (duplicado && duplicado.id !== Number(id)) {
        throw new AppError("Já existe outro produto com esse nome nesta categoria.", 400);
    }

    return await produtoRepository.updateProduto(
        id,
        nome,
        preco,
        categoriaId,
        descricao,
        estoque
    );
}

async function deleteProduto(id) {
    const produto = await produtoRepository.getProduto(id);

    if (!produto) {
        throw new AppError("Produto não encontrado.", 404);
    }

    return await produtoRepository.deleteProduto(id);
}

export default {
    getAllProdutos,
    createProduto,
    updateProduto,
    deleteProduto
};
