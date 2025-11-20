import fetch from 'node-fetch';

async function run() {
  try {
    const resp = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'joao.silva@example.com', senha: 'senha123' })
    });
    const text = await resp.text();
    console.log('status', resp.status);
    console.log('body', text);
  } catch (err) {
    console.error('request error', err && err.stack ? err.stack : err);
  }
}

run();
