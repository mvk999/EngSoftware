// controllers/categoriaController.js
import categoriaServices from "../services/categoriaServices.js";
import { AppError } from "../utils/error.js";

async function getAllCategorias(req, res) {
  try {
    const categorias = await categoriaServices.getAllCategorias();
    return res.status(200).json(categorias);
  } catch (err) {
    console.error("categoriaController.getAllCategorias:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar categorias." });
  }
}

async function getCategoria(req, res) {
  try {
    const { id } = req.params;
    const categoria = await categoriaServices.getCategoria(id);
    return res.status(200).json(categoria);
  } catch (err) {
    console.error("categoriaController.getCategoria:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar categoria." });
  }
}

async function createCategoria(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({
        message: "Nome inválido. Mínimo 3 caracteres."
      });
    }

    const nova = await categoriaServices.createCategoria(nome.trim());
    return res.status(201).json(nova);
  } catch (err) {
    console.error("categoriaController.createCategoria:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao criar categoria." });
  }
}

async function updateCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({
        message: "Nome inválido. Mínimo 3 caracteres."
      });
    }

    const atualizado = await categoriaServices.updateCategoria(id, nome.trim());
    return res.status(200).json(atualizado);
  } catch (err) {
    console.error("categoriaController.updateCategoria:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao atualizar categoria." });
  }
}

async function deleteCategoria(req, res) {
  try {
    const { id } = req.params;

    const deletado = await categoriaServices.deleteCategoria(id);
    return res.status(200).json(deletado);
  } catch (err) {
    console.error("categoriaController.deleteCategoria:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao excluir categoria." });
  }
}

export default {
  getAllCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
