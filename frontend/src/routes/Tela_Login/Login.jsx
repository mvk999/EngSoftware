import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoLogin from "../../assets/LogoLogin.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        senha
      });

      const token = response.data.token;

      if (!token) {
        alert("Erro inesperado: token não retornado.");
        return;
      }

      // Armazenar token
      localStorage.setItem("token", token);

      // Redirecionar para a home/dashboard
      navigate("/");

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Credenciais inválidas.");
        } else if (error.response.status === 400) {
          alert("Requisição inválida. Verifique os dados.");
        } else {
          alert("Erro ao fazer login.");
        }
      } else {
        alert("Erro de conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">

      {/* Lado esquerdo cinza escuro */}
      <div className="login-left">

      {/* Formulário */}
      <div className="login-card">
        <span className="voltar" onClick={() => navigate(-1)}>←</span>

        <p className="bemvindo">Bem vindo de volta!!</p>
        <h1 className="titulo">Login</h1>

        <form onSubmit={handleLogin}>
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <a className="esqueceu" href="/esqueceu">Esqueceu a Senha?</a>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "LOGIN →"}
          </button>
        </form>

        <p className="cadastro">
          Não tem uma conta?{" "}
          <span onClick={() => navigate("/register")}>Cadastre-se</span>
        </p>
      </div>
      </div>

      {/* Logo direita */}
      <div className="login-right">
        <img
          src={LogoLogin}
          className="login-logo"
          alt="Vought Tech"
        />
      </div>
    </div>
  );
}
