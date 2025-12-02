// controllers/produtoController.js
import produtoServices from "../services/produtoServices.js";
import { AppError } from "../utils/error.js";

async function getProdutos(req, res) {
  try {
    const produtos = await produtoServices.getProdutos();
    return res.status(200).json(produtos);
  } catch (err) {
    console.error("produtoController.getProdutos:", err);
    return res.status(500).json({ message: "Erro ao buscar produtos." });
  }
}
async function getProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await produtoServices.getProduto(id);
    if (!produto)
      return res.status(404).json({ message: "Produto não encontrado." });

    return res.status(200).json(produto);
  } catch (err) {
    console.error("produtoController.getProduto:", err);
    return res.status(500).json({ message: "Erro ao buscar produto." });
  }
}


async function createProduto(req, res) {
  try {
    const { nome, preco, descricao, estoque } = req.body;

    const categoriaId =
      req.body.categoriaId ??
      req.body.idCategoria ??
      req.body.id_categoria;

    if (!categoriaId)
      return res.status(400).json({ message: "categoriaId é obrigatório." });

    const imagem = req.file ? req.file.filename : null;

    const novo = await produtoServices.createProduto(
      nome,
      preco,
      categoriaId,
      descricao,
      estoque,
      imagem
    );

    return res.status(201).json(novo);
  } catch (err) {
    console.error("produtoController.createProduto:", err);
    return res.status(500).json({ message: "Erro ao criar produto." });
  }
}

async function updateProduto(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco, descricao, estoque } = req.body;

    const categoriaId =
      req.body.categoriaId ??
      req.body.idCategoria ??
      req.body.id_categoria ??
      null;

    const imagem = req.file ? req.file.filename : null;

    const atualizado = await produtoServices.updateProduto(
      id,
      nome,
      preco,
      categoriaId,
      descricao,
      estoque,
      imagem
    );

    return res.status(200).json(atualizado);
  } catch (err) {
    console.error("produtoController.updateProduto:", err);
    return res.status(500).json({ message: "Erro ao atualizar produto." });
  }
}

async function deleteProduto(req, res) {
  try {
    const { id } = req.params;

    const deletado = await produtoServices.deleteProduto(id);
    return res.status(200).json(deletado);
  } catch (err) {
    console.error("produtoController.deleteProduto:", err);
    return res.status(500).json({ message: "Erro ao remover produto." });
  }
}

export default {
  getProdutos,
  getProduto,
  createProduto,
  updateProduto,
  deleteProduto
};
