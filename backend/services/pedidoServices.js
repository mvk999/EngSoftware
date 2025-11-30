import pedidoRepository from "../repositories/pedidoRepository.js";
import carrinhoRepository from "../repositories/carrinhoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
import { AppError } from "../utils/error.js";

async function getAllPedidos() {
    return await pedidoRepository.getAllPedidos();
}

async function getPedido(id) {
    const pedido = await pedidoRepository.getPedido(id);

    if (!pedido) {
        throw new AppError("Pedido não encontrado.", 404);
    }

    return pedido;
}

async function criarPedido(clienteId) {
    // validar cliente
    const cliente = await clienteRepository.getCliente(clienteId);
    if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
    }

    // validar carrinho
    const itens = await carrinhoRepository.getCarrinho(clienteId);
    if (!itens || itens.length === 0) {
        throw new AppError("Carrinho vazio. Não é possível criar pedido.", 400);
    }

    // validar estoque
    for (const item of itens) {
        const produto = await produtoRepository.getProduto(item.produto_id);

        if (!produto) {
            throw new AppError(`Produto ID ${item.produto_id} não encontrado.`, 404);
        }

        if (produto.estoque < item.quantidade) {
            throw new AppError(
                `Estoque insuficiente para o produto "${produto.nome}".`,
                400
            );
        }
    }

    // criar pedido
    const pedido = await pedidoRepository.criarPedido(clienteId);

    // salvar itens
    for (const item of itens) {
        await pedidoRepository.adicionarItemNoPedido(
            pedido.id,
            item.produto_id,
            item.quantidade,
            item.preco
        );

        // atualizar estoque
        await produtoRepository.diminuirEstoque(item.produto_id, item.quantidade);
    }

    // limpar carrinho
    await carrinhoRepository.limparCarrinho(clienteId);

    return {
        mensagem: "Pedido criado com sucesso.",
        pedidoId: pedido.id
    };
}

async function atualizarStatus(id, novoStatus) {
    const pedido = await pedidoRepository.getPedido(id);

    if (!pedido) {
        throw new AppError("Pedido não encontrado.", 404);
    }

    const statusValidos = ["pendente", "processando", "enviado", "entregue", "cancelado"];

    if (!statusValidos.includes(novoStatus)) {
        throw new AppError("Status inválido.", 400);
    }

    return await pedidoRepository.atualizarStatus(id, novoStatus);
}

async function cancelarPedido(id) {
    const pedido = await pedidoRepository.getPedido(id);

    if (!pedido) {
        throw new AppError("Pedido não encontrado.", 404);
    }

    if (pedido.status === "cancelado") {
        throw new AppError("Pedido já está cancelado.", 400);
    }

    if (pedido.status === "entregue") {
        throw new AppError("Não é possível cancelar um pedido já entregue.", 400);
    }

    // restaurar estoque
    const itens = await pedidoRepository.getItensPedido(id);

    for (const item of itens) {
        await produtoRepository.aumentarEstoque(item.produto_id, item.quantidade);
    }

    return await pedidoRepository.atualizarStatus(id, "cancelado");
}

export default {
    getAllPedidos,
    getPedido,
    criarPedido,
    atualizarStatus,
    cancelarPedido
};
