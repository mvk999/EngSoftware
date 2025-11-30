import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação e recuperação de senha
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *             required:
 *               - email
 *               - senha
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha inválida
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/reset:
 *   post:
 *     summary: Solicita redefinição de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Token de recuperação enviado
 */
router.post("/reset", authController.solicitarResetSenha);

/**
 * @swagger
 * /auth/reset/{token}:
 *   post:
 *     summary: Redefine a senha usando um token válido
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de redefinição de senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senha:
 *                 type: string
 *             required:
 *               - senha
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post("/reset/:token", authController.redefinirSenha);

export default router;
