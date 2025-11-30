// services/pedidoServices.js
import pedidoRepository from "../repositories/pedidoRepository.js";
import carrinhoRepository from "../repositories/carrinhoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
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

async function criarPedido(clienteId) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const itens = await carrinhoRepository.getCarrinho(clienteId);
  if (!itens || itens.length === 0)
    throw new AppError("Carrinho vazio.", 400);

  // ===================================================================
  // CALCULAR TOTAL DO PEDIDO
  // ===================================================================
  let total = 0;

  for (const item of itens) {
    const produto = await produtoRepository.getProduto(item.id_produto);
    if (!produto)
      throw new AppError(`Produto ID ${item.id_produto} não encontrado.`, 404);

    total += Number(produto.preco) * Number(item.quantidade);
  }

  // ===================================================================
  // TRANSAÇÃO
  // ===================================================================
  return await db.transaction(async (trx) => {
    
    // Criar pedido COM valor_total correto
    const pedido = await pedidoRepository.criarPedido(clienteId, total, trx);
    const pedidoId = pedido.id_pedido;

    // Adicionar itens ao pedido + diminuir estoque
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

    // Limpar carrinho
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

export default {
  getAllPedidos,
  getPedido,
  getPedidosByCliente,
  criarPedido,
  atualizarStatus,
  cancelarPedidoCliente,
  cancelarPedidoAdmin
};
