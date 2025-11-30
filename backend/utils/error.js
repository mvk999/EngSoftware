export class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

// middleware global de erros
export default function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ erro: err.message });
    }

    console.error("Erro interno:", err);
    return res.status(500).json({ erro: "Erro interno do servidor" });
}
