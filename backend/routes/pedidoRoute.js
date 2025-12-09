// routes/pedidoRoute.js
import express from "express";
import pedidoController from "../controllers/pedidoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

/**
 * ================================
 * ROTAS DO CLIENTE
 * ================================
 */

// Ver pedidos do próprio cliente
router.get(
  "/me",
  authMiddleware,
  errorBoundary(pedidoController.getPedidosByCliente)
);

// Criar pedido a partir do próprio carrinho
router.post(
  "/",
  authMiddleware,
  errorBoundary(pedidoController.criarPedido)
);

// Cancelar pedido do próprio cliente
router.delete(
  "/me/:id",
  authMiddleware,
  validateId("id"),
  errorBoundary(pedidoController.cancelarPedidoCliente)
);

/**
 * ================================
 * ROTAS DO ADMIN
 * ================================
 */

// Listar todos os pedidos
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  errorBoundary(pedidoController.getAllPedidos)
);

// Obter detalhes de um pedido
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateId("id"),
  errorBoundary(pedidoController.getPedido)
);

// Atualizar pedido (status, itens e estoque)
router.put(
  "/:id", // A rota continua com PUT /pedido/:id
  authMiddleware,
  adminMiddleware,
  validateId("id"),
  errorBoundary(pedidoController.atualizarPedido)
);

// Cancelar pedido — ADMIN
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateId("id"),
  errorBoundary(pedidoController.cancelarPedidoAdmin)
);

// Deletar pedido
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateId("id"),
  errorBoundary(pedidoController.deletarPedido)
);

export default router;
