import fs from 'fs';
import BD from '../repositories/bd.js';

async function run() {
  const sql = fs.readFileSync('docs_back/script_schema.sql', 'utf8');
  const client = await BD.conectar();
  try {
    await client.query(sql);
    console.log('Migrações aplicadas com sucesso.');
  } catch (err) {
    console.error('Erro ao aplicar migrações:', err && err.stack ? err.stack : err);
  } finally {
    client.release();
  }
}

run();
