// routes/Tela_Admin/Produtos.jsx
import './Produto.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import NavBarAdmin from '../NavBarAdmin';
import ProdutoTable from './Table';
import ProdutoModal from './ProdutoModal';

const API_BASE_URL = 'http://localhost:8080'; // ajuste se sua API estiver em outra porta/host

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar'); // 'editar' ou 'cadastrar'
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // =============================
  // CARREGAR LISTA (GET /produto)
  // =============================
  const carregarProdutos = async () => {
    try {
      const resp = await axios.get(`${API_BASE_URL}/produto`);
      // espera que resp.data seja um array de produtos
      setProdutos(resp.data || []);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // =============================
  // ABRIR MODAL
  // =============================
  const handleAbrirModalEditar = (produto) => {
    setProdutoSelecionado(produto);   // row completo vindo da tabela
    setModoModal('editar');
    setShowModal(true);
  };

  const handleAbrirModalCadastrar = () => {
    setProdutoSelecionado(null);
    setModoModal('cadastrar');
    setShowModal(true);
  };

  // ====================================================
  // SALVAR (POST /produto ou PUT /produto/{id})
  // ====================================================
  const handleConfirmarModal = async (produtoEditadoOuNovo) => {
    try {
      if (modoModal === 'editar') {
        // PUT /produto/{id}
        const id = produtoEditadoOuNovo.id; // ajuste se no backend for idProduto etc.
        const resp = await axios.put(
          `${API_BASE_URL}/produto/${id}`,
          produtoEditadoOuNovo
        );

        const produtoAtualizado = resp.data || produtoEditadoOuNovo;

        setProdutos((prev) =>
          prev.map((p) => (p.id === id ? produtoAtualizado : p))
        );
      } else {
        // POST /produto
        const resp = await axios.post(
          `${API_BASE_URL}/produto`,
          produtoEditadoOuNovo
        );

        const produtoCriado = resp.data || produtoEditadoOuNovo;

        setProdutos((prev) => [...prev, produtoCriado]);
      }
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    } finally {
      setShowModal(false);
      setProdutoSelecionado(null);
    }
  };

  // ==========================================
  // EXCLUIR (DELETE /produto/{id})
  // ==========================================
  const handleExcluirProduto = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/produto/${id}`);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
    }
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setProdutoSelecionado(null);
  };

  return (
    <div className='Container'>
      <ProdutoModal
        isOpen={showModal}
        onClose={handleFecharModal}
        onConfirm={handleConfirmarModal}
        categoria={produtoSelecionado}
        modo={modoModal}
      />

      <NavBarAdmin />

      <div className='ContentCategorias'>
        <div className='TopContentCategorias'>
          <img src="/src/assets/Avatar.svg" alt='Avatar' />
          <button className="ButtonAdmin">Admin</button>
          <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
        </div>

        <ProdutoTable
          produtos={produtos}
          onEditarCategoria={handleAbrirModalEditar}
          onDeleteProduto={handleExcluirProduto}
        />

        <button
          className="ButtonAdmin"
          onClick={handleAbrirModalCadastrar}
        >
          Cadastrar Produtos
        </button>
      </div>
    </div>
  );
}

export default Produtos;
