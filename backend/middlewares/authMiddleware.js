import { validateToken } from "../utils/jwt.js";

export default function authMiddleware(req, res, next) {

    // 🔥 Ignorar autenticação durante testes
    if (process.env.NODE_ENV === "test") {
        req.user = { id: 1, tipo: "ADMIN" }; // finge ser admin
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ erro: "Token não fornecido." });

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer")
        return res.status(401).json({ erro: "Token mal formatado." });

    const decoded = validateToken(token);

    if (!decoded)
        return res.status(401).json({ erro: "Token inválido ou expirado." });

    req.user = decoded;
    next();
}
