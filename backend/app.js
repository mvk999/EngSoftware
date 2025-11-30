// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import router from "./routes/indexRoute.js";
import swaggerDocs from "./utils/swagger.js";
import db from "./repositories/bd.js";
import errorHandler from "./utils/error.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
    try {
        await db.initDB();

        // Rotas principais
        app.use("/", router);

        // Swagger
        swaggerDocs(app);

        // Tratamento global de erros (último middleware)
        app.use(errorHandler);

        // Start
        app.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });

    } catch (err) {
        console.error("❌ ERRO FATAL ao iniciar a aplicação:", err);
        process.exit(1);
    }
}

startServer();
