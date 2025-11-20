import express from "express";
import carrinhoController from "../controllers/carrinhoController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carrinho
 *   description: Operações referentes ao carrinho de compras
 */

/**
 * @swagger
 * /carrinho/{clienteId}:
 *   get:
 *     summary: Retorna o carrinho do cliente
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrinho carregado com sucesso
 */
router.get("/:clienteId", carrinhoController.getCarrinho);

/**
 * @swagger
 * /carrinho/{clienteId}:
 *   post:
 *     summary: Adiciona um item ao carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produtoId:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *             required:
 *               - produtoId
 *               - quantidade
 *     responses:
 *       201:
 *         description: Item adicionado ao carrinho
 */
router.post("/:clienteId", carrinhoController.adicionarItem);

/**
 * @swagger
 * /carrinho/{clienteId}/{produtoId}:
 *   put:
 *     summary: Atualiza a quantidade de um item no carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidade:
 *                 type: integer
 *             required:
 *               - quantidade
 *     responses:
 *       200:
 *         description: Item atualizado
 */
router.put("/:clienteId/:produtoId", carrinhoController.atualizarItem);

/**
 * @swagger
 * /carrinho/{clienteId}/{produtoId}:
 *   delete:
 *     summary: Remove um item específico do carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removido
 */
router.delete("/:clienteId/:produtoId", carrinhoController.removerItem);

/**
 * @swagger
 * /carrinho/{clienteId}:
 *   delete:
 *     summary: Limpa todos os itens do carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrinho limpo
 */
router.delete("/:clienteId", carrinhoController.limparCarrinho);

export default router;
