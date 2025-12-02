// routes/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../../utils/auth"; // ajuste o caminho se precisar
import Logo from "../../assets/Logo.svg"
import Carrinho from "../../assets/Carrinho.svg"
import Sacola from "../../assets/Sacola.svg"
import Casinha from "../../assets/Casinha.svg"
import Avatar from "../../assets/Avatar.svg"
import Lupa from "../../assets/Lupa.svg"
import NavBarAdmin from "../Tela_Admin/NavBarAdmin";
import { getUserType } from "../../utils/auth";

import "./Dashboard.css";

const API_BASE_URL = "http://localhost:3000";

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [autenticado, setAutenticado] = useState(isAuthenticated());
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    if (isAuthenticated()) {
        const tipo = getUserType();
        setIsAdmin(tipo === "ADMIN");
    }
    }, []);

  useEffect(() => {
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_BASE_URL}/produto`);

      const produtosCorrigidos = resp.data.map((p) => ({
        id: p.id_produto,                // ID certo
        idCategoria: p.id_categoria,     // categoria certa
        nome: p.nome,
        descricao: p.descricao,
        preco: Number(p.preco),          // converter preco
        estoque: p.estoque,
        categoriaNome: p.categoria_nome
      }));

      setProdutos(produtosCorrigidos);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setErro("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  carregarProdutos();
}, []);


  const handleLoginLogout = () => {
    if (autenticado) {
      localStorage.removeItem("token");
      setAutenticado(false);
      alert("Você saiu da sua conta.");
    } else {
      navigate("/login");
    }
  };
const handleAdicionarCarrinho = async (produtoId) => {
  if (!isAuthenticated()) {
    alert("Faça login para adicionar produtos ao carrinho.");
    navigate("/login");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token inválido. Faça login novamente.");
    navigate("/login");
    return;
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Corrigido: usaremos o nome correto esperado pela API
  const payload = {
    idProduto: produtoId,  // Agora a chave é `idProduto`
    quantidade: 1
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/carrinho`, payload, config);
    console.log(response);
    alert("Produto adicionado ao carrinho.");
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    if (err.response) {
      alert(err.response.data.message || "Erro ao adicionar produto ao carrinho.");
    } else {
      alert("Erro desconhecido ao adicionar ao carrinho.");
    }
  }
};




  return (
    <div className="dashboard">
      {/* Sidebar fixa à esquerda */}
      <aside className="dashboard__sidebar">
        <img src={Logo}></img>
        <nav className="sidebar__menu">
            {/* Início */}
            <button className="sidebar__item sidebar__item--active">
            <img src={Casinha} />
            Início
            </button>

        {/* Botões adicionais para ADMIN */}
        {isAdmin && (
        <>
            <button
            className="sidebar__item"
            onClick={() => navigate("/pedidos")}
            >
            <img src={Casinha} />
            Pedidos
            </button>

            <button
            className="sidebar__item"
            onClick={() => navigate("/produtos")}
            >
            <img src={Casinha} />
            Produtos
            </button>
        </>
        )}
    </nav>
    </aside>


      {/* Conteúdo principal */}
      <main className="dashboard__main">
        {/* Navbar superior */}
        <header className="dashboard__navbar">
          <div className="navbar__search">
            <button className="navbar__search-button"><img src={Lupa}></img></button>
            <input
              type="text"
              placeholder="Pesquisar"
              className="navbar__search-input"
            />
          </div>

          <div className="navbar__actions">
            <button className="buttoncarrinho" onClick={() => navigate("/carrinho")}>
                <img src={Sacola}></img>
            </button>
            <button
              className="navbar__login-button"
              onClick={handleLoginLogout}
            >
              {autenticado ? "Sair" : "Fazer login"}
            </button>

            <img src={Avatar}></img>
          </div>
        </header>

        {/* Vitrine de produtos */}
        <section className="dashboard__content">
          {loading && (
            <p className="dashboard__message">Carregando produtos...</p>
          )}

          {erro && (
            <p className="dashboard__message dashboard__message--erro">
              {erro}
            </p>
          )}

          {!loading && !erro && (
            <div className="dashboard__grid">
              {produtos.map((produto) => (
                <article key={produto.id} className="product-card">
                  <div className="product-card__image-wrapper">
                    {produto.imagemUrl ? (
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        className="product-card__image"
                      />
                    ) : (
                      <div className="product-card__image product-card__image--placeholder">
                        {produto.nome?.[0] || "?"}
                      </div>
                    )}
                  </div>

                  <div className="product-card__body">
                    <h3 className="product-card__title">{produto.nome}</h3>
                    <p className="product-card__subtitle">
                      {produto.descricao}
                    </p>

                    <div className="product-card__footer">
                      <span className="product-card__price">
                        {Number(produto.preco || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>

                      <button
                        className="product-card__cart-button"
                        onClick={() => handleAdicionarCarrinho(produto.id)}
                      >
                        <img src={Carrinho}></img>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
