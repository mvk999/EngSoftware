import express from "express";
import produtoController from "../controllers/produtoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import validateId from "../middlewares/validateIdMiddleware.js";
import errorBoundary from "../middlewares/errorBoundary.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// -------------------------
// ROTAS PÚBLICAS
// -------------------------
router.get("/", errorBoundary(produtoController.getProdutos));

router.get(
    "/:id",
    validateId("id"),
    errorBoundary(produtoController.getProduto)
);

router.get("/:id", errorBoundary(produtoController.getProduto));


// -------------------------
// ROTAS ADMIN 
// -------------------------
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.single("imagem"),
    errorBoundary(produtoController.createProduto)
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    validateId("id"),
    upload.single("imagem"),
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
