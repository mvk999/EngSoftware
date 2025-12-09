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
  const pedidos = await pedidoRepository.getAllPedidos();

  return Promise.all(
    pedidos.map(async (p) => {
      const cliente = await clienteRepository.getCliente(p.id_cliente);
      const endereco = await enderecoRepository.getEndereco(p.endereco_id);
      return { ...p, cliente, endereco };
    })
  );
}

// =========================
// Pedido por ID
// =========================
async function getPedido(id) {
  if (!id) throw new AppError("ID do pedido é obrigatório.", 400);

  const pedido = await pedidoRepository.getPedido(id);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itens = await pedidoRepository.getItensPedido(id);
  const cliente = await clienteRepository.getCliente(pedido.id_cliente);
  const endereco = await enderecoRepository.getEndereco(pedido.endereco_id);

  return { ...pedido, itens, cliente, endereco };
}

// =========================
// Pedidos de um cliente
// =========================
async function getPedidosByCliente(clienteId) {
  const cliente = await clienteRepository.getCliente(clienteId);
  if (!cliente) throw new AppError("Cliente não encontrado.", 404);

  const pedidos = await pedidoRepository.getPedidosByCliente(clienteId);

  return Promise.all(
    pedidos.map(async (p) => {
      const itens = await pedidoRepository.getItensPedido(p.id_pedido);
      return { ...p, itens };
    })
  );
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
  if (!itensCarrinho.length) throw new AppError("Carrinho vazio.", 400);

  let total = 0;
  for (const item of itensCarrinho) {
    const produto = await produtoRepository.getProduto(item.id_produto);

    if (!produto) throw new AppError(`Produto ID ${item.id_produto} não encontrado.`, 404);

    if (produto.estoque < item.quantidade)
      throw new AppError(`Estoque insuficiente para ${produto.nome}`, 400);

    total += Number(produto.preco) * Number(item.quantidade);
  }

  return await db.transaction(async (trx) => {
    const pedido = await pedidoRepository.criarPedido(clienteId, total, enderecoId, trx);

    const itensInseridos = [];
    for (const item of itensCarrinho) {
      const produto = await produtoRepository.getProduto(item.id_produto, trx);

      const novoItem = await pedidoRepository.adicionarItemNoPedido(
        pedido.id_pedido,
        produto.id_produto,
        item.quantidade,
        produto.preco,
        trx
      );

      itensInseridos.push(novoItem);

      await produtoRepository.diminuirEstoque(produto.id_produto, item.quantidade, trx);
    }

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
async function atualizarStatus(pedidoId, status) {
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

    await pedidoRepository.atualizarStatus(pedidoId, "cancelado", trx);
    return { mensagem: "Pedido cancelado com sucesso." };
  });
}

// =========================
// Cancelar pedido (Admin)
// =========================
async function cancelarPedidoAdmin(pedidoId) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  if (["cancelado", "entregue"].includes(pedido.status))
    throw new AppError("Não é possível cancelar este pedido.", 400);

  return await db.transaction(async (trx) => {
    const itens = await pedidoRepository.getItensPedido(pedidoId, trx);

    for (const item of itens) {
      await produtoRepository.aumentarEstoque(item.id_produto, item.quantidade, trx);
    }

    await pedidoRepository.atualizarStatus(pedidoId, "cancelado", trx);
    return { mensagem: "Pedido cancelado pelo admin." };
  });
}

// =========================
// Atualizar item de pedido
// =========================
async function atualizarItemPedido(pedidoId, produtoId, quantidade) {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  const itensPedido = await pedidoRepository.getItensPedido(pedidoId);
  const item = itensPedido.find((i) => i.id_produto === Number(produtoId));

  if (!item) throw new AppError("Item do pedido não encontrado.", 404);

  const produto = await produtoRepository.getProduto(produtoId);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  const diferenca = quantidade - item.quantidade;

  if (diferenca > 0) {
    await produtoRepository.diminuirEstoque(produtoId, diferenca);
  } else if (diferenca < 0) {
    await produtoRepository.aumentarEstoque(produtoId, -diferenca);
  }

  await pedidoRepository.atualizarItemPedido(pedidoId, produtoId, quantidade);

  const itensAtualizados = await pedidoRepository.getItensPedido(pedidoId);

  const totalAtualizado = itensAtualizados.reduce(
    (acc, i) => acc + Number(i.quantidade) * Number(i.preco_unitario),
    0
  );

  await pedidoRepository.atualizarValorTotal(pedidoId, totalAtualizado);

  return {
    ...pedido,
    itens: itensAtualizados,
    valor_total: totalAtualizado
  };
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

// =========================
// Atualizar pedido (ENDPOINT PRINCIPAL)
// =========================
async function atualizarPedido(
  pedidoId,
  { status, clienteId, enderecoId, endereco, itens, removerItens }
)
 {
  const pedido = await pedidoRepository.getPedido(pedidoId);
  if (!pedido) throw new AppError("Pedido não encontrado.", 404);

  return await db.transaction(async (trx) => {

    // 1) Alterar cliente
    if (clienteId) {
      const bloqueados = ["enviado", "entregue"];

      if (bloqueados.includes(pedido.status)) {
        throw new AppError(
          `Não é possível alterar o cliente de pedidos com status '${pedido.status}'.`,
          400
        );
      }

      const cliente = await clienteRepository.getCliente(clienteId);
      if (!cliente) throw new AppError("Cliente não encontrado.", 404);

      await pedidoRepository.atualizarCliente(pedidoId, clienteId, trx);
    }

    // 2) Atualizar endereço
    if (enderecoId) {
      const end = await enderecoRepository.getEndereco(enderecoId);
      if (!end) throw new AppError("Endereço não encontrado.", 404);

      await pedidoRepository.atualizarEndereco(pedidoId, enderecoId, trx);
    }

    if (endereco) {
      const campos = ["rua", "numero", "bairro", "cidade", "estado", "cep"];

      for (const c of campos) {
        if (!endereco[c]) {
          throw new AppError(`Campo '${c}' é obrigatório no endereço.`, 400);
        }
      }

      await enderecoRepository.atualizarEnderecoPorPedido(
        pedidoId,
        endereco,
        trx
      );
    }
// 3-A) Remover itens específicos
if (Array.isArray(removerItens) && removerItens.length > 0) {
  const itensAtuais = await pedidoRepository.getItensPedido(pedidoId, trx);

  for (const r of removerItens) {
    const idProduto = Number(r.idProduto);
    const item = itensAtuais.find(i => i.id_produto === idProduto);

    if (!item) {
      throw new AppError(
        `O produto ID ${idProduto} não pertence ao pedido e não pode ser removido.`,
        400
      );
    }

    // Devolver estoque
    await produtoRepository.aumentarEstoque(idProduto, item.quantidade, trx);

    // Remover item do pedido
    await pedidoRepository.removerItemPedido(pedidoId, idProduto, trx);
  }

  // Recalcula o total após as remoções
  const itensRestantes = await pedidoRepository.getItensPedido(pedidoId, trx);

  const novoTotal = itensRestantes.reduce(
    (acc, i) => acc + Number(i.quantidade) * Number(i.preco_unitario),
    0
  );

  await pedidoRepository.atualizarValorTotal(pedidoId, novoTotal, trx);
}

    // 3) Atualizar itens
    if (Array.isArray(itens)) {
      const itensAtuais = await pedidoRepository.getItensPedido(pedidoId, trx);

      for (const item of itensAtuais) {
        await produtoRepository.aumentarEstoque(item.id_produto, item.quantidade, trx);
      }

      await pedidoRepository.removerTodosItensPedido(pedidoId, trx);

      let novoTotal = 0;

      for (const item of itens) {
        const { idProduto, quantidade } = item;

        const produto = await produtoRepository.getProduto(idProduto, trx);

        if (!produto)
          throw new AppError(`Produto ID ${idProduto} não encontrado.`, 404);

        if (produto.estoque < quantidade)
          throw new AppError(`Estoque insuficiente para '${produto.nome}'.`, 400);

        await pedidoRepository.adicionarItemNoPedido(
          pedidoId,
          idProduto,
          quantidade,
          produto.preco,
          trx
        );

        await produtoRepository.diminuirEstoque(idProduto, quantidade, trx);

        novoTotal += Number(produto.preco) * Number(quantidade);
      }

      await pedidoRepository.atualizarValorTotal(pedidoId, novoTotal, trx);
    }

    // 4) Atualizar status
    if (status) {
      const validos = ["pendente", "processando", "enviado", "entregue", "cancelado"];

      if (!validos.includes(status))
        throw new AppError("Status inválido.", 400);

      await pedidoRepository.atualizarStatus(pedidoId, status, trx);
    }

    // 5) Retorno final
    const pedidoAtualizado = await pedidoRepository.getPedido(pedidoId, trx);
    const itensAtualizados = await pedidoRepository.getItensPedido(pedidoId, trx);
    const enderecoFinal = await enderecoRepository.getEndereco(pedidoAtualizado.endereco_id, trx);

    return {
      ...pedidoAtualizado,
      itens: itensAtualizados,
      endereco: enderecoFinal
    };
  });
}


// =========================
// EXPORT
// =========================
export default {
  getAllPedidos,
  getPedido,
  getPedidosByCliente,
  criarPedido,
  atualizarStatus,
  cancelarPedidoCliente,
  cancelarPedidoAdmin,
  atualizarItemPedido,
  deletarPedido,
  atualizarPedido
};
