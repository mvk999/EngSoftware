import express from "express";
import clienteController from "../controllers/clienteController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cliente
 *   description: Endpoints relacionados aos clientes
 */

// Apenas cadastro de cliente (RF010) permanece

// rota GET /cliente/:id removida para alinhar ao Documento de Requisitos

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               salario:
 *                 type: number
 *               nasc:
 *                 type: string
 *                 format: date
 *             required:
 *               - cpf
 *               - nome
 *               - email
 *               - senha
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", clienteController.createCliente);

// rota PUT /cliente/:id removida para alinhar ao Documento de Requisitos

// rota DELETE /cliente/:id removida para alinhar ao Documento de Requisitos

export default router;
