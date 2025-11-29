import bcrypt from "bcrypt";

export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hashed) {
    return await bcrypt.compare(password, hashed);
}
