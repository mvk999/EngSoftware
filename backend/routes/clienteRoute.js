// routes/clienteRoute.js
import express from "express";
import clienteController from "../controllers/clienteController.js";
import validateBody from "../middlewares/validateBodyMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

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


router.get(
    "/:id",
    adminMiddleware,
    validateId("id"),
    errorBoundary(clienteController.getClienteById)
);


export default router;
