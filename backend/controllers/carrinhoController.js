// controllers/carrinhoController.js
import carrinhoServices from "../services/carrinhoServices.js";
import { AppError } from "../utils/error.js";

async function getCarrinho(req, res) {
  try {
    const clienteId = req.user.id;
    const carrinho = await carrinhoServices.getCarrinho(clienteId);

    return res.status(200).json(carrinho); // já tem itens + valorTotal
  } catch (err) {
    console.error("carrinhoController.getCarrinho:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar carrinho." });
  }
}


async function adicionarItem(req, res) {
  try {
    const clienteId = req.user.id;
    const { idProduto, quantidade, produtoId } = req.body;

    // Aceita tanto idProduto quanto produtoId para compatibilidade
    const idProd = idProduto || produtoId;

    if (!idProd || quantidade == null)
      return res.status(400).json({
        message: "idProduto e quantidade são obrigatórios."
      });

    if (quantidade < 1)
      return res.status(400).json({
        message: "Quantidade deve ser no mínimo 1 (RBR-110)."
      });

    const resultado = await carrinhoServices.adicionarItem(
      clienteId,
      idProd,
      quantidade
    );

    return res.status(201).json(resultado);
  } catch (err) {
    console.error("carrinhoController.adicionarItem:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({
      message: "Erro ao adicionar item ao carrinho."
    });
  }
}

async function atualizarItem(req, res) {
  try {
    const clienteId = req.user.id;
    const { produtoId } = req.params;
    const { quantidade } = req.body;

    if (!quantidade)
      return res
        .status(400)
        .json({ message: "Quantidade é obrigatória." });

    if (quantidade < 1)
      return res.status(400).json({
        message: "Quantidade deve ser no mínimo 1 (RBR-110)."
      });

    const resultado = await carrinhoServices.atualizarItem(
      clienteId,
      produtoId,
      quantidade
    );

    return res.status(200).json(resultado);
  } catch (err) {
    console.error("carrinhoController.atualizarItem:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({
      message: "Erro ao atualizar item do carrinho."
    });
  }
}

async function removerItem(req, res) {
  try {
    const clienteId = req.user.id;
    const { produtoId } = req.params;

    await carrinhoServices.removerItem(clienteId, produtoId);

    return res
      .status(200)
      .json({ message: "Item removido com sucesso." });
  } catch (err) {
    console.error("carrinhoController.removerItem:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res
      .status(500)
      .json({ message: "Erro ao remover item do carrinho." });
  }
}

async function limparCarrinho(req, res) {
  try {
    const clienteId = req.user.id;

    await carrinhoServices.limparCarrinho(clienteId);

    return res
      .status(200)
      .json({ message: "Carrinho esvaziado com sucesso." });
  } catch (err) {
    console.error("carrinhoController.limparCarrinho:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res
      .status(500)
      .json({ message: "Erro ao limpar carrinho." });
  }
}

export default {
  getCarrinho,
  adicionarItem,
  atualizarItem,
  removerItem,
  limparCarrinho
};
