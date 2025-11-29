import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes/indexRoute.js";
import swaggerDocs from "./utils/swagger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas principais
app.use("/", router);

// Swagger UI
swaggerDocs(app);

// Servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
