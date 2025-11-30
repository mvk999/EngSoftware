// middlewares/ownerMiddleware.js
import { AppError } from "../utils/error.js";

/**
 * ownerMiddleware(paramName):
 * Verifica se req.params[paramName] === req.user.id
 * 
 * Exemplo de uso:
 * router.get("/:clienteId", ownerMiddleware("clienteId"), controller)
 */
export default function ownerMiddleware(paramName = "id") {
    return (req, res, next) => {
        const idRecurso = Number(req.params[paramName]);
        const idUsuario = Number(req.user?.id);

        if (!idRecurso || !idUsuario) {
            throw new AppError("Identificação inválida.", 400);
        }

        if (idRecurso !== idUsuario) {
            throw new AppError("Acesso não autorizado ao recurso solicitado.", 403);
        }

        next();
    };
}
