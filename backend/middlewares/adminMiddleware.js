// middlewares/adminMiddleware.js
import { AppError } from "../utils/error.js";

export default function adminMiddleware(req, res, next) {
    if (!req.user || req.user.tipo !== "ADMIN") {
        throw new AppError("Acesso permitido somente para administradores.", 403);
    }
    next();
}
