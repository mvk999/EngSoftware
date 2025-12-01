// routes/enderecoRoute.js
import express from "express";
import enderecoController from "../controllers/enderecoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

/**
 * Rotas de Endereço
 * Todas exigem autenticação (cada usuário só gerencia seu próprio endereço)
 */

// Lista TODOS os endereços do usuário autenticado
router.get(
    "/",
    authMiddleware,
    errorBoundary(enderecoController.listarEnderecos)
);

// Busca endereço específico
router.get(
    "/:id",
    authMiddleware,
    validateId("id"),
    errorBoundary(enderecoController.getEndereco)
);

// Criar novo endereço
router.post(
    "/",
    authMiddleware,
    errorBoundary(enderecoController.criarEndereco)
);

// Atualizar endereço
router.put(
    "/:id",
    authMiddleware,
    validateId("id"),
    errorBoundary(enderecoController.atualizarEndereco)
);

export default router;
