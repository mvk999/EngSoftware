// routes/authRoute.js
import express from "express";
import authController from "../controllers/authController.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

/**
 * POST /auth/login
 * POST /auth/reset
 * POST /auth/reset/:token
 */

router.post("/login", errorBoundary(authController.login));

router.post("/reset", errorBoundary(authController.solicitarResetSenha));

router.post("/reset/:token", errorBoundary(authController.redefinirSenha));

export default router;
