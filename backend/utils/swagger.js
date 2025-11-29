import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const openapiPath = path.resolve("docs_back/openapi.json");
let openapiBase = {};

if (fs.existsSync(openapiPath)) {
    openapiBase = JSON.parse(fs.readFileSync(openapiPath, "utf8"));
}

const options = {
    definition: {
        openapi: "3.0.0",
        ...openapiBase,
        info: {
            title: "Vought Tech API",
            version: "1.0.0",
            description: "Documentação da API do sistema Vought Tech",
        },
        servers: [
            { url: "http://localhost:3000", description: "Servidor local" }
        ]
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Documentação Swagger disponível em: http://localhost:3000/api-docs");
}

export default swaggerDocs;
