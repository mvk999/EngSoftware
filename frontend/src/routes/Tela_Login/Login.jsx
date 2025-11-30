import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  LogoLogin  from "../../assets/LogoLogin.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    console.log("Login enviado:", { email, senha });

    // Depois você integra com seu backend aqui
    // axios.post("/login", {email, senha})

    navigate("/"); // Volta à tela inicial após logar
  }

  return (
    <div className="login-container">

      {/* Lado esquerdo cinza escuro */}
      <div className="login-left"></div>

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
          />

          <label className="label">Senha</label>
            
          <input
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <a className="esqueceu" href="/esqueceu">Esqueceu a Senha?</a>
          <button className="btn-login" type="submit">
            LOGIN →
          </button>
        </form>

        <p className="cadastro">
          Não tem uma conta?{" "}
          <span onClick={() => navigate("/register")}>Cadastre-se</span>
        </p>
      </div>

      {/* Logo direita */}
      <div className="login-right">
      <img
        src= {LogoLogin}
        className="login-logo"
        alt="Vought Tech"
      />
      </div>
    </div>
  );
}
