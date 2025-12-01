// controllers/produtoController.js
import produtoServices from "../services/produtoServices.js";
import { AppError } from "../utils/error.js";

async function getProdutos(req, res) {
  try {
    const termo = req.query.q || null;

    const categoriaIdQuery =
      req.query.categoriaId ??
      req.query.idCategoria ??
      req.query.id_categoria ??
      null;

    const filtros = {
      termo,
      categoriaId: categoriaIdQuery,
      precoMin: req.query.precoMin || null,
      precoMax: req.query.precoMax || null,
      ordenar: req.query.ordem || "nome"
    };

    const produtos = await produtoServices.getProdutos(filtros);
    return res.status(200).json(produtos);
  } catch (err) {
    console.error("produtoController.getProdutos:", err);
    return res.status(500).json({ message: "Erro ao buscar produtos." });
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
  createProduto,
  updateProduto,
  deleteProduto
};
