import express from "express";

import authRoute from "./authRoute.js";
import clienteRoute from "./clienteRoute.js";
import categoriaRoute from "./categoriaRoute.js";
import produtoRoute from "./produtoRoute.js";
import carrinhoRoute from "./carrinhoRoute.js";
import pedidoRoute from "./pedidoRoute.js";

const router = express.Router();

// todas as rotas ficam organizadas aqui
router.use("/auth", authRoute);
router.use("/cliente", clienteRoute);
router.use("/categoria", categoriaRoute);
router.use("/produto", produtoRoute);
router.use("/carrinho", carrinhoRoute);
router.use("/pedido", pedidoRoute);

export default router;
