// services/categoriaServices.js
import categoriaRepository from "../repositories/categoriaRepository.js";
import produtoRepository from "../repositories/produtoRepository.js";
import { AppError } from "../utils/error.js";

async function getAllCategorias() {
  return await categoriaRepository.getAllCategorias();
}

async function getCategoria(id) {
  if (!id) throw new AppError("ID da categoria é obrigatório.", 400);

  const categoria = await categoriaRepository.getCategoria(id);
  if (!categoria) throw new AppError("Categoria não encontrada.", 404);

  return categoria;
}

async function createCategoria(nome) {
  if (!nome || nome.trim().length < 3) {
    throw new AppError(
      "O nome da categoria deve conter ao menos 3 caracteres.",
      400
    );
  }

  const existente = await categoriaRepository.getCategoriaByNome(nome.trim());
  if (existente) {
    throw new AppError("Já existe uma categoria com esse nome.", 400);
  }

  return await categoriaRepository.createCategoria(nome.trim());
}

async function updateCategoria(id, nome) {
  if (!id) throw new AppError("ID da categoria é obrigatório.", 400);

  if (!nome || nome.trim().length < 3) {
    throw new AppError(
      "O nome da categoria deve conter ao menos 3 caracteres.",
      400
    );
  }

  const categoria = await categoriaRepository.getCategoria(id);
  if (!categoria) throw new AppError("Categoria não encontrada.", 404);

  const existeNome = await categoriaRepository.getCategoriaByNome(nome.trim());
  if (existeNome && existeNome.id !== Number(id)) {
    throw new AppError("Já existe outra categoria com esse nome.", 400);
  }

  return await categoriaRepository.updateCategoria(id, nome.trim());
}

async function deleteCategoria(id) {
  if (!id) throw new AppError("ID da categoria é obrigatório.", 400);

  const categoria = await categoriaRepository.getCategoria(id);
  if (!categoria) throw new AppError("Categoria não encontrada.", 404);

  // Regra RBR-040 — impedir exclusão se houver produtos associados
  const vinculados = await produtoRepository.getProdutosByCategoria(id);

  if (vinculados.length > 0) {
    throw new AppError(
      "Não é possível excluir esta categoria pois ela está associada a produtos.",
      400
    );
  }

  return await categoriaRepository.deleteCategoria(id);
}

export default {
  getAllCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
