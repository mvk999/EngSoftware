import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoLogin from "../../assets/LogoLogin.png";
import "../Tela_Login/Login.css"; // reutiliza o mesmo CSS

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (senha !== confirmar) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
    await axios.post("http://localhost:3000/cliente", {
        nome,
        email,
        senha,
        cpf
    });

    alert("Conta criada com sucesso!");
    navigate("/login");

    } catch (err) {
    console.error(err);
    if (err.response) {
        if (err.response.status === 400) {
        alert("Dados inválidos ou já existentes.");
        } else {
        alert("Erro ao criar conta.");
        }
    } else {
        alert("Erro ao conectar ao servidor.");
    }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">

      <div className="login-left">

      <div className="login-card">
        <span className="voltar" onClick={() => navigate(-1)}>←</span>

        <h1 className="titulo" style={{ marginTop: "40px" }}>Cadastre-se</h1>

        <form onSubmit={handleRegister}>

          <label className="label">Nome</label>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label className="label">Email</label>
          <input
            type="email"
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label">CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <label className="label">Senha</label>
          <input
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <label className="label">Confirmar Senha</label>
          <input
            type="password"
            placeholder="********"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "CADASTRAR →"}
          </button>

        </form>

        <p className="cadastro">
          Já tem uma conta?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
      </div>
      <div className="login-right">
        <img src={LogoLogin} className="login-logo" alt="Vought Tech" />
      </div>
      
    </div>
  );
}
