// services/carrinhoServices.js
import carrinhoRepository from "../repositories/carrinhoRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { AppError } from "../utils/error.js";

async function getCarrinho(clienteId) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const itens = await carrinhoRepository.getCarrinho(clienteId);

  const resultado = [];
  let valorTotal = 0;

  for (const item of itens) {
    const produto = await produtoRepository.getProduto(item.id_produto);

    if (!produto) {
      await carrinhoRepository.removerItem(clienteId, item.id_produto).catch(() => {});
      continue;
    }

    resultado.push({
      idProduto: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      preco: produto.preco,
      estoque: produto.estoque
    });

    valorTotal += produto.preco * item.quantidade; // soma o total
  }

  return { itens: resultado, valorTotal }; // retorna objeto com itens + total
}

async function adicionarItem(clienteId, produtoId, quantidade) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const produto = await produtoRepository.getProduto(produtoId);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  if (!Number.isInteger(quantidade) || quantidade < 1)
    throw new AppError("Quantidade deve ser maior ou igual a 1.", 400);

  const itemExistente = await carrinhoRepository.getItem(clienteId, produtoId);

  const atual = itemExistente ? itemExistente.quantidade : 0;
  const novaQtd = atual + quantidade;

  if (novaQtd > produto.estoque)
    throw new AppError(
      `Estoque insuficiente. Disponível: ${produto.estoque}.`,
      400
    );

  if (itemExistente) {
    return await carrinhoRepository.atualizarItem(
      clienteId,
      produtoId,
      novaQtd
    );
  }

  return await carrinhoRepository.adicionarItem(
    clienteId,
    produtoId,
    quantidade
  );
}

async function atualizarItem(clienteId, produtoId, quantidade) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const produto = await produtoRepository.getProduto(produtoId);
  if (!produto) {
    await carrinhoRepository.removerItem(clienteId, produtoId).catch(() => {});
    throw new AppError("Produto não encontrado.", 404);
  }

  if (!Number.isInteger(quantidade) || quantidade < 1)
    throw new AppError("Quantidade deve ser maior ou igual a 1.", 400);

  const item = await carrinhoRepository.getItem(clienteId, produtoId);
  if (!item)
    throw new AppError("Item não encontrado no carrinho.", 404);

  if (quantidade > produto.estoque)
    throw new AppError(
      `Estoque insuficiente. Disponível: ${produto.estoque}.`,
      400
    );

  return await carrinhoRepository.atualizarItem(
    clienteId,
    produtoId,
    quantidade
  );
}

async function removerItem(clienteId, produtoId) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const item = await carrinhoRepository.getItem(clienteId, produtoId);
  if (!item)
    throw new AppError("Item não encontrado no carrinho.", 404);

  return await carrinhoRepository.removerItem(clienteId, produtoId);
}

async function limparCarrinho(clienteId) {
  if (!clienteId) throw new AppError("Cliente inválido.", 400);

  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  return await carrinhoRepository.limparCarrinho(clienteId);
}

export default {
  getCarrinho,
  adicionarItem,
  atualizarItem,
  removerItem,
  limparCarrinho
};