import express from "express";
import enderecoController from "../controllers/enderecoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

/**
 * Rotas de Endereço
 * Todas exigem autenticação
 */

// Lista todos do usuário autenticado
router.get(
  "/me",
  authMiddleware,
  errorBoundary(enderecoController.getMeusEnderecos)
);

// Buscar endereço específico
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

export default router;
