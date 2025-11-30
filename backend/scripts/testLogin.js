import authServices from "../services/authServices.js";

async function run() {
  try {
    const res = await authServices.login("joao.silva@example.com", "senha123");
    console.log("Resultado:", res);
  } catch (err) {
    console.error("Erro ao testar login:", err && err.stack ? err.stack : err);
  }
}

run();
