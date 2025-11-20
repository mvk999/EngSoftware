import express from "express";
import produtoController from "../controllers/produtoController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Produto
 *   description: Endpoints relacionados aos produtos
 */

/**
 * @swagger
 * /produto:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produto]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
router.get("/", produtoController.getAllProdutos);

// rota GET /produto/:id removida para alinhar ao Documento de Requisitos (buscar/listar permanece)

/**
 * @swagger
 * /produto:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               estoque:
 *                 type: integer
 *               categoriaId:
 *                 type: integer
 *             required:
 *               - nome
 *               - preco
 *               - estoque
 *               - categoriaId
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post("/", produtoController.createProduto);

/**
 * @swagger
 * /produto/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produto]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do produto
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               estoque:
 *                 type: integer
 *               categoriaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put("/:id", produtoController.updateProduto);

/**
 * @swagger
 * /produto/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Produto]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete("/:id", produtoController.deleteProduto);

export default router;
