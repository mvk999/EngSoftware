// repositories/bd.js
import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: Number(process.env.DB_POOL_MAX || 10)
});

async function conectar() {
  return pool.connect();
}

async function transaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* ============================================================
   SEED AUTOMÁTICO DO ADMIN
   - Executado toda vez que o servidor sobe
   - Só cria se não existir
   - email: admin@vought.com
   - senha: admin123
============================================================ */
async function seedAdmin() {
  const client = await pool.connect();

  try {
    const email = "admin@vought.com";

    // Verifica se já existe admin
    const check = await client.query(
      "SELECT id_usuario FROM usuarios WHERE email = $1",
      [email]
    );

    if (check.rowCount > 0) {
      console.log("👑 Admin já existe no banco");
      console.log("   Email: admin@vought.com");
      console.log("   Senha: admin123");
      return;
    }

    const senhaHash = await bcrypt.hash("admin123", 10);

    // >>> CORRIGIDO: tipo = 'ADMIN' (maiusculo)
    await client.query(
      `INSERT INTO usuarios (nome, email, cpf, senha, tipo)
       VALUES ($1, $2, $3, $4, 'ADMIN')`,
      ["Administrador", email, "00000000000", senhaHash]
    );

    console.log("👑 Admin criado automaticamente:");
    console.log("   Email: admin@vought.com");
    console.log("   Senha: admin123");
  } catch (err) {
    console.error("❌ Erro ao criar admin:", err);
  } finally {
    client.release();
  }
}

/* ============================================================
   INICIALIZAÇÃO COMPLETA DO BANCO
   - Executa schema SQL
   - Executa SEED do admin automaticamente
============================================================ */
async function initDB() {
  try {

    const schemaPath = path.resolve("docs_backend/script_schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    await pool.query(sql);

    // 🔥 Seed de administrador
    await seedAdmin();

    console.log("✅ Banco inicializado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao inicializar o banco:", err);
  }
}

export default { conectar, transaction, initDB, pool };
