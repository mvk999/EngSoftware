import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "vought_super_secret";

// gerar token JWT
export function generateToken(payload, expiresIn = "2h") {
    return jwt.sign(payload, SECRET, { expiresIn });
}

// validar token JWT
export function validateToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}

// middleware de autenticação
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ erro: "Token não fornecido" });

    const [, token] = authHeader.split(" ");

    const decoded = validateToken(token);

    if (!decoded)
        return res.status(401).json({ erro: "Token inválido ou expirado" });

    req.user = decoded;
    next();
}
