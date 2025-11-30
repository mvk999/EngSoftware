import express from "express";
import pedidoController from "../controllers/pedidoController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pedido
 *   description: Endpoints relacionados a pedidos
 */

/**
 * @swagger
 * /pedido:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedido]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get("/", pedidoController.getAllPedidos);

/**
 * @swagger
 * /pedido/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Pedido]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do pedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:id", pedidoController.getPedido);

/**
 * @swagger
 * /pedido/{clienteId}:
 *   post:
 *     summary: Cria um novo pedido com base no carrinho do cliente
 *     tags: [Pedido]
 *     parameters:
 *       - name: clienteId
 *         in: path
 *         required: true
 *         description: ID do cliente dono do carrinho
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Carrinho vazio ou dados inválidos
 */
router.post("/:clienteId", pedidoController.criarPedido);

/**
 * @swagger
 * /pedido/{id}/status:
 *   put:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedido]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, pago, enviado, entregue, cancelado]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put("/:id/status", pedidoController.atualizarStatus);

/**
 * @swagger
 * /pedido/{id}:
 *   delete:
 *     summary: Cancela um pedido pelo ID
 *     tags: [Pedido]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:id", pedidoController.cancelarPedido);

export default router;
