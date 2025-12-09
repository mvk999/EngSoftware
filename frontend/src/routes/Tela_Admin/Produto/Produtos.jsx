// routes/Tela_Admin/Produtos.jsx
import './Produto.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { isAdmin } from '../../../utils/auth';
import NavBarAdmin from '../NavBarAdmin';
import ProdutoTable from './Table';
import ProdutoModal from './ProdutoModal';

const API_BASE_URL = 'http://localhost:3000';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(true);

  // Pega token JWT do localStorage
  const getConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    // Garante que somente ADMIN veja
    if (!isAdmin()) {
      setAutorizado(false);
      alert("Acesso restrito ao Admin.");
      return;
    }

    setAutorizado(true);
    carregarDados();
  }, []);

  const carregarDados = async () => {
  try {
    setLoading(true);

    const config = getConfig();

    const [respProd, respCat] = await Promise.all([
      axios.get(`${API_BASE_URL}/produto`, config || {}),
      axios.get(`${API_BASE_URL}/categoria`, {})
    ]);

    // ⚠️ Normalização — garante id e idCategoria SEMPRE presentes
    const produtosNormalizados = (respProd.data || []).map((p) => ({
      id: p.id ?? p.idProduto ?? p.id_produto ?? p.ID ?? null,
      nome: p.nome ?? p.name,
      descricao: p.descricao ?? "",
      preco: p.preco ?? 0,
      estoque: p.estoque ?? 0,
      
      // Categoria pode vir:
      // - p.idCategoria
      // - p.id_categoria
      // - p.categoria.id
      idCategoria:
        p.idCategoria ??
        p.id_categoria ??
        p.idcategoria ??
        p.categoria?.id ??
        null,
    }));

    setProdutos(produtosNormalizados);
    setCategorias(respCat.data || []);

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    alert("Erro ao carregar produtos/categorias.");
  } finally {
    setLoading(false);
  }
};


  // Abrir modal para editar produto
  const handleAbrirModalEditar = (produto) => {
    setProdutoSelecionado(produto);
    setModoModal('editar');
    setShowModal(true);
  };

  // Abrir modal para cadastrar novo produto
  const handleAbrirModalCadastrar = () => {
    setProdutoSelecionado(null);
    setModoModal('cadastrar');
    setShowModal(true);
  };

  // Confirmação do modal (criar/editar)
  const handleConfirmarModal = async (form) => {
    const config = getConfig();
    if (!config) {
      alert("Token inválido ou ausente. Faça login novamente.");
      return;
    }

    try {
      // Monta o payload exatamente como o schema Produto do JSON:
      // { nome, descricao, preco, estoque, idCategoria }
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(String(form.preco).replace(',', '.')),
        estoque: parseInt(form.estoque, 10),
        idCategoria: parseInt(form.idCategoria, 10),
      };

      // Conversões seguras
      const precoConvertido = Number(String(payload.preco).replace(",", "."));
      const estoqueConvertido = Number(payload.estoque);

      // Verificações
      if (!payload.nome.trim()) {
        alert("Nome é obrigatório.");
        return;
      }

      if (!payload.idCategoria) {
        alert("Selecione uma categoria.");
        return;
      }

      if (isNaN(precoConvertido) || precoConvertido <= 0) {
        alert("Preço inválido.");
        return;
      }

      if (isNaN(estoqueConvertido) || estoqueConvertido < 0) {
        alert("Estoque inválido.");
        return;
      }

      // Aplicar valores convertidos no payload final
      payload.preco = precoConvertido;
      payload.estoque = estoqueConvertido;


      if (modoModal === 'editar') {
        // PUT /produto/{id}
        const id = form.id;

        // Se há um arquivo de imagem (File), envie como FormData
        if (form.imagem instanceof File) {
          const fd = new FormData();
          fd.append('nome', payload.nome);
          fd.append('descricao', payload.descricao || '');
          fd.append('preco', String(payload.preco));
          fd.append('estoque', String(payload.estoque));
          fd.append('idCategoria', String(payload.idCategoria));
          fd.append('imagem', form.imagem);

          await axios.put(`${API_BASE_URL}/produto/${id}`, fd, config);
        } else {
          await axios.put(`${API_BASE_URL}/produto/${id}`, payload, config);
        }

        // Atualiza lista local sem perder o restante dos dados
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, ...payload, id } : p
          )
        );
        alert("Produto atualizado com sucesso.");
      } else {
        // POST /produto
        let resp;
        if (form.imagem instanceof File) {
          const fd = new FormData();
          fd.append('nome', payload.nome);
          fd.append('descricao', payload.descricao || '');
          fd.append('preco', String(payload.preco));
          fd.append('estoque', String(payload.estoque));
          fd.append('idCategoria', String(payload.idCategoria));
          fd.append('imagem', form.imagem);

          resp = await axios.post(`${API_BASE_URL}/produto`, fd, config);
        } else {
          resp = await axios.post(`${API_BASE_URL}/produto`, payload, config);
        }

        // Backend deve devolver o produto criado com id
        const novoProduto = resp.data;

        if (novoProduto && novoProduto.id) {
          setProdutos((prev) => [...prev, novoProduto]);
        } else {
          // Se não vier o objeto inteiro, recarrega da API
          await carregarDados();
        }

        alert("Produto cadastrado com sucesso.");
      }

      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      const msg = err.response?.data?.erro || "Erro ao salvar produto.";
      alert(msg);
    }
  };

  // Excluir produto
  const handleExcluirProduto = async (idProduto) => {
    if (!idProduto) {
      alert("Erro: ID de produto inválido.");
      return;
    }

    if (!window.confirm("Deseja excluir este produto?")) return;

    const config = getConfig();
    if (!config) {
      alert("Token inválido ou ausente. Faça login novamente.");
      return;
    }

    try {
      // DELETE /produto/{id}
      await axios.delete(`${API_BASE_URL}/produto/${idProduto}`, config);
      setProdutos((prev) => prev.filter((p) => p.id !== idProduto));
      alert("Produto excluído com sucesso.");
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      const msg = err.response?.data?.erro || "Erro ao excluir produto.";
      alert(msg);
    }
  };

  if (!autorizado) {
    // Não mostra nada da tela pra quem não é ADMIN
    return (
      <div className="prod-container" style={{ color: '#fff', padding: 20 }}>
        Acesso restrito. Apenas administradores podem visualizar esta página.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="prod-container" style={{ color: '#fff', padding: 20 }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="prod-container">
      {/* Modal de criar/editar produto */}
      <ProdutoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmarModal}
        produto={produtoSelecionado}
        listaCategorias={categorias}
        modo={modoModal}
      />

      {/* Navbar que você já tem pronta */}
      <NavBarAdmin />

      {/* Mantendo as classes originais para não quebrar o CSS */}
      <div className="prod-content-categorias">
        <div className="prod-top-content-categorias">
          <img src="/src/assets/Avatar.svg" alt="Avatar" />
          <button id="btn-admin" className="prod-button-admin" data-testid="prod-btn-admin">Admin</button>
          <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
        </div>

        {/* Tabela de produtos com ações de editar/deletar */}
        <ProdutoTable
          produtos={produtos}
          onEditarProduto={handleAbrirModalEditar}
          onDeleteProduto={handleExcluirProduto}
        />

        {/* Botão para abrir modal de cadastro */}
        <button
          className="prod-button-admin"
          id="btn-cadastrar-produto"
          data-testid="prod-btn-open-cadastrar"
          onClick={handleAbrirModalCadastrar}
          style={{ marginTop: '20px' }}
        >
          Cadastrar Produtos
        </button>
      </div>
    </div>
  );
}

export default Produtos;
