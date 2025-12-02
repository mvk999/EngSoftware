import pedidoRepository from "../repositories/pedidoRepository.js";
import carrinhoRepository from "../repositories/carrinhoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
import enderecoRepository from "../repositories/enderecoRepository.js"; 
import db from "../repositories/bd.js";
import { AppError } from "../utils/error.js";

// =========================
// Listar todos pedidos (Admin)
// =========================
async function getAllPedidos() {
  return await pedidoRepository.getAllPedidos();
}

// =========================
// Pedido por ID
// =========================
async function getPedido(id) {
  if (!id) throw new AppError("ID do pedido é obrigatório.", 400);

  const pedido = await pedidoRepository.getPedido(id);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itens = await pedidoRepository.getItensPedido(id);
  return { ...pedido, itens };
}

// =========================
// Pedidos de um cliente
// =========================
async function getPedidosByCliente(clienteId) {
  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const pedidos = await pedidoRepository.getPedidosByCliente(clienteId);
  const pedidosComItens = [];
  for (let pedido of pedidos) {
    const itens = await pedidoRepository.getItensPedido(pedido.id_pedido);
    pedidosComItens.push({ ...pedido, itens });
  }
  return pedidosComItens;
}

// =========================
// Criar pedido (cliente)
// =========================
async function criarPedido(clienteId, enderecoId) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const endereco = await enderecoRepository.getEndereco(enderecoId);
  if (!endereco) throw new AppError("Endereço não encontrado.", 404);
  if (endereco.id_usuario !== clienteId)
    throw new AppError("Endereço não pertence ao cliente autenticado.", 403);

  const itensCarrinho = await carrinhoRepository.getCarrinho(clienteId);
  if (!itensCarrinho || itensCarrinho.length === 0)
    throw new AppError("Carrinho vazio.", 400);

  // calcula total e valida estoque
  let total = 0;
  for (const item of itensCarrinho) {
    const produto = await produtoRepository.getProduto(item.id_produto);
    if (!produto) throw new AppError(`Produto ID ${item.id_produto} não encontrado.`, 404);
    if (produto.estoque < item.quantidade)
      throw new AppError(`Estoque insuficiente para ${produto.nome}`, 400);
    total += Number(produto.preco) * Number(item.quantidade);
  }

  return await db.transaction(async (trx) => {
    // 1) criar pedido
    const pedido = await pedidoRepository.criarPedido(clienteId, total, enderecoId, trx);

    // 2) adicionar itens e decrementar estoque
    const itensInseridos = [];
    for (const item of itensCarrinho) {
      const produto = await produtoRepository.getProduto(item.id_produto, trx);
      const itemInserido = await pedidoRepository.adicionarItemNoPedido(
        pedido.id_pedido,
        produto.id_produto,
        item.quantidade,
        produto.preco,
        trx
      );
      itensInseridos.push(itemInserido);
      await produtoRepository.diminuirEstoque(produto.id_produto, item.quantidade, trx);
    }

    // 3) limpar carrinho
    await carrinhoRepository.limparCarrinho(clienteId, trx);

    return {
      mensagem: "Pedido criado com sucesso.",
      pedido: {
        ...pedido,
        itens: itensInseridos,
        valor_total: total
      }
    };
  });
}

// =========================
// Atualizar status (Admin)
// =========================
async function atualizarStatus(pedidoId, status, adminId) {
  const permitido = ["pendente", "processando", "enviado", "entregue", "cancelado"];
  if (!permitido.includes(status)) throw new AppError("Status inválido.", 400);

  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  return await pedidoRepository.atualizarStatus(pedidoId, status);
}

// =========================
// Cancelar pedido (cliente)
// =========================
async function cancelarPedidoCliente(pedidoId, clienteId) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);
  if (pedido.id_cliente !== clienteId) throw new AppError("Sem permissão.", 403);
  if (["cancelado", "entregue"].includes(pedido.status))
    throw new AppError("Não é possível cancelar este pedido.", 400);

  return await db.transaction(async (trx) => {
    const itens = await pedidoRepository.getItensPedido(pedidoId, trx);
    for (const item of itens) {
      await produtoRepository.aumentarEstoque(item.id_produto, item.quantidade, trx);
    }
    return await pedidoRepository.atualizarStatus(pedidoId, "cancelado", trx);
  });
}

// =========================
// Cancelar pedido (Admin)
// =========================
async function cancelarPedidoAdmin(pedidoId) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);
  if (pedido.status === "cancelado") throw new AppError("Pedido já cancelado.", 400);

  return await pedidoRepository.atualizarStatus(pedidoId, "cancelado");
}

// =========================
// Atualizar item de pedido
// =========================
async function atualizarItemPedido(pedidoId, produtoId, quantidade) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itensPedido = await pedidoRepository.getItensPedido(pedidoId);
  const item = itensPedido.find(i => i.id_produto === Number(produtoId));
  if (!item) throw new AppError("Item de pedido não encontrado.", 404);

  const produto = await produtoRepository.getProduto(produtoId);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  const diferenca = quantidade - item.quantidade;
  if (diferenca > 0) {
    await produtoRepository.diminuirEstoque(produtoId, diferenca);
  } else if (diferenca < 0) {
    await produtoRepository.aumentarEstoque(produtoId, -diferenca);
  }

  await pedidoRepository.atualizarItemPedido(pedidoId, produtoId, quantidade);

  // Atualiza valor_total do pedido
  const itensAtualizados = await pedidoRepository.getItensPedido(pedidoId);
  const totalAtualizado = itensAtualizados.reduce(
    (acc, i) => acc + i.quantidade * Number(i.preco_unitario),
    0
  );

  return { ...pedido, itens: itensAtualizados, valor_total: totalAtualizado };
}

// =========================
// Deletar pedido
// =========================
async function deletarPedido(pedidoId) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itens = await pedidoRepository.getItensPedido(pedidoId);
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
