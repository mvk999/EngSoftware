import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/indexRoute.js";
import swaggerDocs from "./utils/swagger.js";
import db from "./repositories/bd.js";
import errorHandler from "./utils/error.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AS ROTAS
const uploadsPath = path.join(__dirname, "docs_backend", "uploads");
app.use("/uploads", express.static(uploadsPath));

// ROTAS PRINCIPAIS
app.use("/", router);

// Swagge
swaggerDocs(app);

// Tratamento global de erros
app.use(errorHandler);

// SERVIDOR

export async function startServer() {
    try {
        await db.initDB();

        app.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });

    } catch (err) {
        console.error("❌ ERRO FATAL ao iniciar a aplicação:", err);
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== "test") {
    startServer();
}

export default app;
