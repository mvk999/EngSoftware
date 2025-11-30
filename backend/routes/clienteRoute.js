// routes/clienteRoute.js
import express from "express";
import clienteController from "../controllers/clienteController.js";
import validateBody from "../middlewares/validateBodyMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

/**
 * POST /cliente
 * Cadastro de novo cliente
 */

router.post(
    "/",
    validateBody(["nome", "email", "cpf", "senha"]),
    errorBoundary(clienteController.createCliente)
);

export default router;
