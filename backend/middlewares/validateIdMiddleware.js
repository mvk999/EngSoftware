// middlewares/validateIdMiddleware.js
import { AppError } from "../utils/error.js";

export default function validateIdMiddleware(paramName = "id") {
    return (req, res, next) => {
        const id = Number(req.params[paramName]);

        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError(`Parâmetro '${paramName}' inválido.`, 400);
        }

        next();
    };
}
