import BD from '../repositories/bd.js';
import { hashPassword } from '../utils/password.js';

async function run() {
  const client = await BD.conectar();
  try {
    const email = 'joao.silva@example.com';
    const nome = 'João Silva';
    const cpf = '12345678901';
    const senha = 'senha123';

    const check = await client.query('SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1)', [email]);
    if (check.rows.length > 0) {
      console.log('Usuário já existe:', check.rows[0]);
      return;
    }

    const senhaHash = await hashPassword(senha);
    const sql = 'INSERT INTO usuarios (nome, email, cpf, senha, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario as id, nome, email, cpf';
    const res = await client.query(sql, [nome, email, cpf, senhaHash, 'CLIENTE']);
    console.log('Usuário criado:', res.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário:', err && err.stack ? err.stack : err);
  } finally {
    client.release();
  }
}

run();
