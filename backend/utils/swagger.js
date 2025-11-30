// utils/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const docsPath = path.resolve("./docs_backend/openapi.json");

let openapiBase = {};
if (fs.existsSync(docsPath)) {
    openapiBase = JSON.parse(fs.readFileSync(docsPath, "utf8"));
}

const swaggerOptions = {
    definition: {
        ...openapiBase,

        // Garante valores padrão caso não existam no JSON
        openapi: openapiBase.openapi || "3.0.0",

        info: openapiBase.info || {
            title: "Vought Tech API",
            version: "1.0.0",
            description: "Documentação oficial da API Vought Tech."
        },

        servers: openapiBase.servers || [
            { url: "http://localhost:3000", description: "Servidor local" }
        ],

        components: {
            ...openapiBase.components,
            securitySchemes: {
                ...(openapiBase.components?.securitySchemes || {}),
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        security: openapiBase.security || [{ bearerAuth: [] }]
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger disponível em http://localhost:3000/api-docs");
}
