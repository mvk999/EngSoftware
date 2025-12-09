import express from "express";
import enderecoController from "../controllers/enderecoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

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

// ADMIN: listar endereços de um cliente por ID
router.get(
  "/admin/cliente/:id/enderecos",
  authMiddleware,
  adminMiddleware,
  validateId("id"),
  errorBoundary(enderecoController.getEnderecosByCliente)
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
