// routes/produtoRoute.js
import express from "express";
import produtoController from "../controllers/produtoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";

const router = express.Router();

// PÚBLICO
router.get("/", errorBoundary(produtoController.getProdutos));

router.get(
    "/:id",
    validateId("id"),
    errorBoundary(produtoController.getProduto)
);

// ADMIN
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    errorBoundary(produtoController.createProduto)
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(produtoController.updateProduto)
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    errorBoundary(produtoController.deleteProduto)
);

export default router;
