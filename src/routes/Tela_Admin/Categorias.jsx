import './Categorias.css'
import React, { useState} from "react";
import NavBarAdmin from './NavBarAdmin'
import Table from './Table';
import CategoriaModal from './CategoriaModal';

function Categorias() {
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar'); // 'editar' ou 'cadastrar'
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const handleAbrirModalEditar = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModoModal('editar');
    setShowModal(true);
  };

  const handleAbrirModalCadastrar = () => {
    setCategoriaSelecionada(null);
    setModoModal('cadastrar');
    setShowModal(true);
  };

  const handleConfirmarModal = (novoNome) => {
    if (modoModal === 'editar') {
      console.log(`Categoria atualizada para: ${novoNome}`);
      // Aqui você pode fazer a chamada da API para atualizar a categoria
    } else {
      console.log(`Nova categoria criada: ${novoNome}`);
      // Aqui você pode fazer a chamada da API para criar a categoria
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
        <CategoriaModal 
          isOpen={showModal}
          onClose={handleFecharModal}
          onConfirm={handleConfirmarModal}
          categoriaNome={categoriaSelecionada?.nome || ''}
          modo={modoModal}
        />
        <NavBarAdmin></NavBarAdmin>
        <div className='ContentCategorias'>
            <div className='TopContentCategorias'>
                <img src="/src/assets/Avatar.svg" alt='Avatar' />
                <button className="ButtonAdmin">Admin</button>
                <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
            </div>
            <Table onEditarCategoria={handleAbrirModalEditar}></Table>
            <button className="ButtonAdmin" onClick={handleAbrirModalCadastrar}>Cadastrar Categoria</button>
        </div>
    </div>
  )
}

export default Categorias