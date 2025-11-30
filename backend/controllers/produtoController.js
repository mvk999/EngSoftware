// controllers/produtoController.js
import produtoServices from "../services/produtoServices.js";
import { AppError } from "../utils/error.js";

async function getProdutos(req, res) {
  try {
    // Swagger: apenas ?q=
    const termo = req.query.q || null;

    // Aceita filtros extras (não conflita com Swagger)
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

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar produtos." });
  }
}

/**
 * POST /produto
 * Criação de produto (ADMIN)
 * Aceita no body:
 *  - nome
 *  - preco
 *  - descricao
 *  - estoque
 *  - categoriaId | idCategoria | id_categoria
 */
async function createProduto(req, res) {
  try {
    const { nome, preco, descricao, estoque } = req.body;

    // Aceita múltimos nomes para o mesmo campo:
    const categoriaId =
      req.body.categoriaId ??
      req.body.idCategoria ??
      req.body.id_categoria;

    if (!categoriaId) {
      return res.status(400).json({
        message: "campo categoriaId (ou idCategoria / id_categoria) é obrigatório."
      });
    }

    const novo = await produtoServices.createProduto(
      nome,
      preco,
      categoriaId,
      descricao,
      estoque
    );

    return res.status(201).json(novo);
  } catch (err) {
    console.error("produtoController.createProduto:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao criar produto." });
  }
}

async function updateProduto(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco, descricao, estoque } = req.body;

    // Também aceita os três formatos no update:
    const categoriaId =
      req.body.categoriaId ??
      req.body.idCategoria ??
      req.body.id_categoria ??
      null;

    const atualizado = await produtoServices.updateProduto(
      id,
      nome,
      preco,
      categoriaId,
      descricao,
      estoque
    );

    return res.status(200).json(atualizado);
  } catch (err) {
    console.error("produtoController.updateProduto:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

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

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao remover produto." });
  }
}

export default {
  getProdutos,
  createProduto,
  updateProduto,
  deleteProduto
};
