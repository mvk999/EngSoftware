// utils/jwt.js
import jwt from "jsonwebtoken";
import { AppError } from "./error.js";

const SECRET = process.env.JWT_SECRET || "vought_super_secret";

export function generateToken(payload, expiresIn = null) {
    try {
        return jwt.sign(payload, SECRET, {
            algorithm: "HS256",
            expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || "2h"
        });
    } catch (err) {
        console.error("Erro ao gerar JWT:", err);
        throw new AppError("Erro ao gerar token JWT.", 500);
    }
}

export function validateToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}


export default {
    generateToken,
    validateToken,
};
