import express from "express";
import categoriaController from "../controllers/categoriaController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categoria
 *   description: Endpoints relacionados às categorias de produtos
 */

/**
 * @swagger
 * /categoria:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categoria]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 */
router.get("/", categoriaController.getAllCategorias);

/**
 * @swagger
 * /categoria/{id}:
 *   get:
 *     summary: Busca uma categoria pelo ID
 *     tags: [Categoria]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da categoria
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get("/:id", categoriaController.getCategoria);

/**
 * @swagger
 * /categoria:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *             required:
 *               - nome
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post("/", categoriaController.createCategoria);

/**
 * @swagger
 * /categoria/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categoria]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da categoria
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
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.put("/:id", categoriaController.updateCategoria);

/**
 * @swagger
 * /categoria/{id}:
 *   delete:
 *     summary: Remove uma categoria pelo ID
 *     tags: [Categoria]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da categoria
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete("/:id", categoriaController.deleteCategoria);

export default router;
