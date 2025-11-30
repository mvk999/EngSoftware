// middlewares/validateBodyMiddleware.js
import { AppError } from "../utils/error.js";

export default function validateBodyMiddleware(requiredFields = []) {
    return (req, res, next) => {
        for (const field of requiredFields) {
            if (
                req.body[field] === undefined ||
                req.body[field] === null ||
                req.body[field] === ""
            ) {
                throw new AppError(`Campo obrigatório ausente: '${field}'`, 400);
            }
        }

        next();
    };
}
