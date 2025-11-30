// routes/categoriaRoute.js
import express from "express";
import categoriaController from "../controllers/categoriaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

// Rotas públicas
router.get("/", errorBoundary(categoriaController.getAllCategorias));

router.get(
    "/:id",
    validateId("id"),
    errorBoundary(categoriaController.getCategoria)
);

// ADMIN
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    errorBoundary(categoriaController.createCategoria)
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(categoriaController.updateCategoria)
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(categoriaController.deleteCategoria)
);

export default router;
