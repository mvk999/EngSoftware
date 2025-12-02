// services/produtoServices.js
import produtoRepository from "../repositories/produtoRepository.js";
import categoriaRepository from "../repositories/categoriaRepository.js";
import { AppError } from "../utils/error.js";

async function getProdutos() {
  return await produtoRepository.getProdutos();
}


/**
 * Criar produto + imagem
 */
async function createProduto(
  nome,
  preco,
  categoriaId,
  descricao,
  estoque,
  imagem
) {
  if (!nome || nome.trim().length < 2)
    throw new AppError("Nome deve conter ao menos 2 caracteres.", 400);

  if (!preco || preco <= 0)
    throw new AppError("Preço deve ser maior que zero.", 400);

  if (estoque < 0)
    throw new AppError("Estoque não pode ser negativo.", 400);

  if (!categoriaId)
    throw new AppError("categoriaId é obrigatório.", 400);

  const categoriaIdNum = Number(categoriaId);

  const categoria = await categoriaRepository.getCategoria(categoriaIdNum);
  if (!categoria) throw new AppError("Categoria não encontrada.", 404);

  const nomeTratado = nome.trim();

  const duplicado = await produtoRepository.getProdutoByNomeECategoria(
    nomeTratado,
    categoriaIdNum
  );

  if (duplicado)
    throw new AppError(
      "Já existe um produto com esse nome nesta categoria.",
      400
    );

  return await produtoRepository.createProduto(
    nomeTratado,
    preco,
    categoriaIdNum,
    descricao?.trim() || "",
    estoque,
    imagem
  );
}

/**
 * Atualizar produto + imagem opcional
 */
async function updateProduto(
  id,
  nome,
  preco,
  categoriaId,
  descricao,
  estoque,
  imagem
) {
  const produto = await produtoRepository.getProduto(id);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  let categoriaIdFinal = categoriaId;

  if (categoriaIdFinal !== undefined && categoriaIdFinal !== null) {
    categoriaIdFinal = Number(categoriaIdFinal);
    const categoria = await categoriaRepository.getCategoria(categoriaIdFinal);
    if (!categoria) throw new AppError("Categoria não encontrada.", 404);
  }

  if (preco !== undefined && preco <= 0)
    throw new AppError("Preço deve ser maior que zero.", 400);

  if (estoque !== undefined && estoque < 0)
    throw new AppError("Estoque não pode ser negativo.", 400);

  let nomeTratado = nome;
  if (nome) {
    if (nome.trim().length < 2)
      throw new AppError("Nome deve conter ao menos 2 caracteres.", 400);

    nomeTratado = nome.trim();

    const categoriaParaValidar =
      categoriaIdFinal || produto.id_categoria;

    const duplicado = await produtoRepository.getProdutoByNomeECategoria(
      nomeTratado,
      categoriaParaValidar
    );

    if (duplicado && duplicado.id_produto !== Number(id))
      throw new AppError(
        "Já existe outro produto com esse nome nesta categoria.",
        400
      );
  }

  return await produtoRepository.updateProduto(
    id,
    nomeTratado,
    preco,
    categoriaIdFinal,
    descricao?.trim(),
    estoque,
    imagem
  );
}

async function deleteProduto(id) {
  const produto = await produtoRepository.getProduto(id);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  return await produtoRepository.deleteProduto(id);
}

async function getProduto(id) {
  if (!id) throw new AppError("ID é obrigatório.", 400);

  const produto = await produtoRepository.getProduto(id);
  if (!produto) throw new AppError("Produto não encontrado.", 404);

  return produto;
}


export default {
  getProdutos,
  getProduto,
  createProduto,
  updateProduto,
  deleteProduto
};
