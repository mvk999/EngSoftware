import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoLogin from "../../assets/LogoLogin.png";
import "../Tela_Login/Login.css";

export default function EsqueceuSenha() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [fase, setFase] = useState(1); // 1=email, 2=codigo, 3=senha
  const [tokenReset, setTokenReset] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  //  FASE 1: ENVIAR EMAIL
  // ================================
  async function enviarCodigo(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/auth/reset", { email });
      alert("Código enviado para o email!");
      setFase(2);
    }catch {
      alert("Erro ao enviar código.");
    }finally {
      setLoading(false);
    }
  }

  // ================================
  //  FASE 2: VALIDAR CÓDIGO
  // ================================
  function confirmarCodigo(e) {
    e.preventDefault();

    if (!codigo) {
      alert("Insira o código.");
      return;
    }

    // O back-end usa o código direto como {token}
    setTokenReset(codigo);
    setFase(3);
  }

  // ================================
  //  FASE 3: NOVA SENHA
  // ================================
  async function redefinirSenha(e) {
    e.preventDefault();

    if (novaSenha !== confirmar) {
      alert("Senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`http://localhost:3000/auth/reset/${tokenReset}`, {
        novaSenha,
      });

      alert("Senha redefinida com sucesso!");
      navigate("/login");

    } catch{
      alert("Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">

      <div className="login-left"></div>

      <div className="login-card">

        <span className="voltar" onClick={() => navigate(-1)}>←</span>

        {fase === 1 && (
          <>
            <h1 className="titulo">Recuperação<br />de Senha</h1>

            <form onSubmit={enviarCodigo}>

              <label className="label">Email</label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "ENVIAR →"}
              </button>
            </form>

            <p className="cadastro">
              Já tem uma conta? <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </>
        )}

        {/* -------------------------------------------------- */}
        {fase === 2 && (
          <>
            <h1 className="titulo">Insira o código</h1>

            <form onSubmit={confirmarCodigo}>
              <label className="label">Código recebido</label>
              <input
                type="text"
                placeholder="Código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />

              <button className="btn-login" type="submit">
                Confirmar →
              </button>
            </form>

            <p className="cadastro" onClick={() => setFase(1)}>Voltar</p>
          </>
        )}

        {/* -------------------------------------------------- */}
        {fase === 3 && (
          <>
            <h1 className="titulo">Digite a nova senha</h1>

            <form onSubmit={redefinirSenha}>
              <label className="label">Nova senha</label>
              <input
                type="password"
                placeholder="********"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />

              <label className="label">Confirmar senha</label>
              <input
                type="password"
                placeholder="********"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Confirmar →"}
              </button>
            </form>

            <p className="cadastro" onClick={() => setFase(2)}>Voltar</p>
          </>
        )}

      </div>

      <div className="login-right">
        <img src={LogoLogin} className="login-logo" alt="Vought Tech" />
      </div>
    </div>
  );
}
