// utils/error.js

export class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;

    const response = {
        erro: err.message,
        statusCode: status,
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    console.error("🔥 ERRO:", {
        rota: req.originalUrl,
        metodo: req.method,
        status,
        mensagem: err.message,
        operacional: err.isOperational || false
    });

    return res.status(status).json(response);
}
