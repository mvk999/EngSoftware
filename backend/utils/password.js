// utils/password.js
import bcrypt from "bcrypt";
import { AppError } from "./error.js";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export async function hashPassword(password) {
    try {
        if (!password)
            throw new AppError("Senha inválida.", 400);

        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (err) {
        console.error("❌ Erro ao gerar hash:", err);
        throw new AppError("Erro ao processar senha.", 500);
    }
}

export async function comparePassword(password, hashed) {
    try {
        if (!password || !hashed) return false;
        return await bcrypt.compare(password, hashed);
    } catch (err) {
        console.error("❌ Erro ao comparar hash:", err);
        throw new AppError("Erro ao validar senha.", 500);
    }
}
