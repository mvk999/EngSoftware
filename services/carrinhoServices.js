import carrinhoRepository from "../repositories/carrinhoRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";

async function getCarrinho(clienteId) {
    const cliente = await clienteRepository.getCliente(clienteId);
    if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
    }

    return await carrinhoRepository.getCarrinho(clienteId);
}

async function adicionarItem(clienteId, produtoId, quantidade) {
    // validar cliente
    const cliente = await clienteRepository.getCliente(clienteId);
    if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
    }

    // validar produto
    const produto = await produtoRepository.getProduto(produtoId);
    if (!produto) {
        throw new AppError("Produto não encontrado.", 404);
    }

    // validar quantidade
    if (quantidade <= 0) {
        throw new AppError("Quantidade deve ser maior que zero.", 400);
    }

    // regra: se já existe item, incrementar
    const itemExistente = await carrinhoRepository.getItem(clienteId, produtoId);

    if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade;
        return await carrinhoRepository.atualizarItem(clienteId, produtoId, novaQuantidade);
    }

    // regra: se não existe, inserir novo item
    return await carrinhoRepository.adicionarItem(clienteId, produtoId, quantidade);
}

async function atualizarItem(clienteId, produtoId, quantidade) {
    if (quantidade <= 0) {
        throw new AppError("Quantidade deve ser maior que zero.", 400);
    }

    const item = await carrinhoRepository.getItem(clienteId, produtoId);

    if (!item) {
        throw new AppError("Item não encontrado no carrinho.", 404);
    }

    return await carrinhoRepository.atualizarItem(clienteId, produtoId, quantidade);
}

async function removerItem(clienteId, produtoId) {
    const item = await carrinhoRepository.getItem(clienteId, produtoId);

    if (!item) {
        throw new AppError("Item não encontrado no carrinho.", 404);
    }

    return await carrinhoRepository.removerItem(clienteId, produtoId);
}

async function limparCarrinho(clienteId) {
    const cliente = await clienteRepository.getCliente(clienteId);

    if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
    }

    return await carrinhoRepository.limparCarrinho(clienteId);
}

export default {
    getCarrinho,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho
};
