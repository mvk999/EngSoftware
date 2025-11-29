import './Produto.css';
import React, { useState } from "react";
import NavBarAdmin from '../NavBarAdmin';
import Table from './Table';
import ProdutoModal from './ProdutoModal';

function Produtos() {
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar'); // 'editar' ou 'cadastrar'
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const handleAbrirModalEditar = (categoria) => {
    setCategoriaSelecionada(categoria);   // row completo vindo da tabela
    setModoModal('editar');
    setShowModal(true);
  };

  const handleAbrirModalCadastrar = () => {
    setCategoriaSelecionada(null);
    setModoModal('cadastrar');
    setShowModal(true);
  };

  // agora recebe o objeto inteiro vindo do modal
  const handleConfirmarModal = (categoriaEditadaOuNova) => {
    if (modoModal === 'editar') {
      console.log('Categoria atualizada:', categoriaEditadaOuNova);
      // TODO: chamada de API para atualizar categoria
      // ex: api.put(`/categorias/${categoriaEditadaOuNova.id}`, categoriaEditadaOuNova)
    } else {
      console.log('Nova categoria criada:', categoriaEditadaOuNova);
      // TODO: chamada de API para criar categoria
      // ex: api.post('/categorias', categoriaEditadaOuNova)
    }

    setShowModal(false);
    setCategoriaSelecionada(null);
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setCategoriaSelecionada(null);
  };

  return (
    <div className='Container'>
      <ProdutoModal
        isOpen={showModal}
        onClose={handleFecharModal}
        onConfirm={handleConfirmarModal}
        categoria={categoriaSelecionada}
        modo={modoModal}
      />

      <NavBarAdmin />

      <div className='ContentCategorias'>
        <div className='TopContentCategorias'>
          <img src="/src/assets/Avatar.svg" alt='Avatar' />
          <button className="ButtonAdmin">Admin</button>
          <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
        </div>

        {/* Table chama handleAbrirModalEditar(row) no botão de editar */}
        <Table onEditarCategoria={handleAbrirModalEditar} />

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
