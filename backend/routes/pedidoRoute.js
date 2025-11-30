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

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    errorBoundary(pedidoController.getAllPedidos)
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(pedidoController.getPedido)
);

router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(pedidoController.atualizarStatus)
);

// Cancelar pedido — ADMIN
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(pedidoController.cancelarPedidoAdmin)
);

export default router;
