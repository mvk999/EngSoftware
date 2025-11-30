// routes/carrinhoRoute.js
import express from "express";
import carrinhoController from "../controllers/carrinhoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

/**
 * Todas as rotas exigem autenticação:
 * GET    /carrinho
 * POST   /carrinho
 * DELETE /carrinho
 * PUT    /carrinho/:produtoId
 * DELETE /carrinho/:produtoId
 */

// GET / → retorna carrinho completo
router.get(
    "/",
    authMiddleware, // Aplica o authMiddleware
    errorBoundary(carrinhoController.getCarrinho)
);

// POST / → adiciona item
router.post(
    "/",
    authMiddleware, // Aplica o authMiddleware
    errorBoundary(carrinhoController.adicionarItem)
);

// DELETE / → limpa carrinho
router.delete(
    "/",
    authMiddleware, // Aplica o authMiddleware
    errorBoundary(carrinhoController.limparCarrinho)
);

// PUT /:produtoId → atualiza quantidade
router.put(
    "/:produtoId",
    authMiddleware, // Aplica o authMiddleware
    validateId("produtoId"),
    errorBoundary(carrinhoController.atualizarItem)
);

// DELETE /:produtoId → remove item
router.delete(
    "/:produtoId",
    authMiddleware, // Aplica o authMiddleware
    validateId("produtoId"),
    errorBoundary(carrinhoController.removerItem)
);

export default router;
