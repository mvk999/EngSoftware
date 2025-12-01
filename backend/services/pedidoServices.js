import pedidoRepository from "../repositories/pedidoRepository.js";
import carrinhoRepository from "../repositories/carrinhoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
import enderecoRepository from "../repositories/enderecoRepository.js"; 
import db from "../repositories/bd.js";
import { AppError } from "../utils/error.js";

async function getAllPedidos() {
  return await pedidoRepository.getAllPedidos();
}

async function getPedido(id) {
  if (!id) throw new AppError("ID do pedido é obrigatório.", 400);

  const pedido = await pedidoRepository.getPedido(id);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  return pedido;
}

async function getPedidosByCliente(clienteId) {
  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  return await pedidoRepository.getPedidosByCliente(clienteId);
}

async function criarPedido(clienteId, enderecoId) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const endereco = await enderecoRepository.getEndereco(enderecoId); 
  if (!endereco) throw new AppError("Endereço não encontrado.", 404);

  const itens = await carrinhoRepository.getCarrinho(clienteId);
  if (!itens || itens.length === 0)
    throw new AppError("Carrinho vazio.", 400);

  let total = 0;
  for (const item of itens) {
    const produto = await produtoRepository.getProduto(item.id_produto);
    if (!produto)
      throw new AppError(`Produto ID ${item.id_produto} não encontrado.`, 404);

    total += Number(produto.preco) * Number(item.quantidade);
  }

  return await db.transaction(async (trx) => {
    const pedido = await pedidoRepository.criarPedido(clienteId, total, enderecoId, trx); 
    const pedidoId = pedido.id_pedido;

    for (const item of itens) {
      const produto = await produtoRepository.getProduto(item.id_produto, trx);

      await pedidoRepository.adicionarItemNoPedido(
        pedidoId,
        produto.id_produto,
        item.quantidade,
        produto.preco,
        trx
      );

      await produtoRepository.diminuirEstoque(
        produto.id_produto,
        item.quantidade,
        trx
      );
    }

    await carrinhoRepository.limparCarrinho(clienteId, trx);

    return {
      mensagem: "Pedido criado com sucesso.",
      pedidoId,
      total
    };
  });
}

async function atualizarStatus(pedidoId, status) {
  const permitido = ["pendente", "processando", "enviado", "entregue", "cancelado"];

  if (!permitido.includes(status))
    throw new AppError("Status inválido.", 400);

  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  return await pedidoRepository.atualizarStatus(pedidoId, status);
}

async function cancelarPedidoCliente(pedidoId, clienteId) {
  if (!pedidoId) throw new AppError("ID do pedido é obrigatório.", 400);

  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  if (pedido.id_cliente !== clienteId)
    throw new AppError("Sem permissão.", 403);

  if (pedido.status === "cancelado")
    throw new AppError("Pedido já está cancelado.", 400);

  if (pedido.status === "entregue")
    throw new AppError("Não é possível cancelar um pedido já entregue.", 400);

  return await db.transaction(async (trx) => {
    const itens = await pedidoRepository.getItensPedido(pedidoId, trx);

    for (const item of itens) {
      await produtoRepository.aumentarEstoque(
        item.id_produto,
        item.quantidade,
        trx
      );
    }

    return await pedidoRepository.atualizarStatus(
      pedidoId,
      "cancelado",
      trx
    );
  });
}

async function cancelarPedidoAdmin(pedidoId) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  if (pedido.status === "cancelado")
    throw new AppError("Pedido já está cancelado.", 400);

  return await pedidoRepository.atualizarStatus(pedidoId, "cancelado");
}


// Atualiza um item no pedido e ajusta o estoque
async function atualizarItemPedido(pedidoId, produtoId, quantidade) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itemPedido = await pedidoRepository.getItensPedido(pedidoId);
  if (!itemPedido) throw new AppError("Item de pedido não encontrado.", 404);

  const produto = await produtoRepository.getProduto(produtoId);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  // Ajustar o estoque
  const estoqueAtual = itemPedido.quantidade;
  const novaQuantidade = quantidade;
  
  if (novaQuantidade > estoqueAtual) {
    await produtoRepository.diminuirEstoque(produtoId, novaQuantidade - estoqueAtual);
  } else {
    await produtoRepository.aumentarEstoque(produtoId, estoqueAtual - novaQuantidade);
  }

  return await pedidoRepository.atualizarItemPedido(pedidoId, produtoId, quantidade);
}

// Deleta um pedido e restaura o estoque dos produtos
async function deletarPedido(pedidoId) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itens = await pedidoRepository.getItensPedido(pedidoId);

  // Restaurar o estoque dos produtos
  for (const item of itens) {
    await produtoRepository.aumentarEstoque(item.id_produto, item.quantidade);
  }

  await pedidoRepository.deletarPedido(pedidoId);

  return { mensagem: "Pedido deletado com sucesso." };
}

export default {
  getAllPedidos,
  getPedido,
  getPedidosByCliente,
  criarPedido,
  atualizarStatus,
  cancelarPedidoCliente,
  cancelarPedidoAdmin,
  atualizarItemPedido,
  deletarPedido
};
