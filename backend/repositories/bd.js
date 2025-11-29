import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool;

function conectar() {
    if (!pool) {
        pool = new pg.Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        global.connection = pool;
    }
    return pool.connect();
}

export default { conectar };
