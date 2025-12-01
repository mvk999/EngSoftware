import '../Produto/Produto.css';
import React, { useState } from "react";
import NavBarAdmin from '../NavBarAdmin';
import PedidosTable from './PedidosTable';
import PedidoModal from './PedidoModal';


function Pedidos() {
  const [pedidos, setPedidos] = useState();
  const [usuarios, setUsuarios] = useState();
  const [enderecos, setEnderecos] = useState();

  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar'); // 'editar' ou 'cadastrar'

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

  // Abrir modal para EDITAR pedido + cliente + endereço
  const handleAbrirModalEditar = (pedido) => {
    const usuario = usuarios.find(u => u.idUsuario === pedido.idCliente) || null;
    const endereco = enderecos.find(e => e.idEndereco === pedido.idEndereco) || null;

    setPedidoSelecionado(pedido);
    setUsuarioSelecionado(usuario);
    setEnderecoSelecionado(endereco);
    setModoModal('editar');
    setShowModal(true);
  };
  
  // Abrir modal para CADASTRAR novo pedido + novo cliente + novo endereço
  const handleAbrirModalCadastrar = () => {
    setPedidoSelecionado(null);
    setUsuarioSelecionado(null);
    setEnderecoSelecionado(null);
    setModoModal('cadastrar');
    setShowModal(true);
  };

  // Confirmar modal: recebe pedido/usuario/endereco já preenchidos
  const handleConfirmarModal = ({ pedido, usuario, endereco, modo }) => {
    if (modo === 'editar') {
      // atualiza pedido
      setPedidos(prev =>
        prev.map(p => p.idPedido === pedido.idPedido ? pedido : p)
      );

      // upsert usuário
      setUsuarios(prev => {
        const existe = prev.some(u => u.idUsuario === usuario.idUsuario);
        if (!existe) return [...prev, usuario];
        return prev.map(u => u.idUsuario === usuario.idUsuario ? usuario : u);
      });

      // upsert endereço
      setEnderecos(prev => {
        const existe = prev.some(e => e.idEndereco === endereco.idEndereco);
        if (!existe) return [...prev, endereco];
        return prev.map(e => e.idEndereco === endereco.idEndereco ? endereco : e);
      });
    } else {
      // CADASTRO NOVO: gera IDs simples (mock). No backend depois vem do banco.
      const nextIdPedido =
        pedidos.length > 0
          ? Math.max(...pedidos.map(p => p.idPedido)) + 1
          : 1;
      const nextIdUsuario =
        usuarios.length > 0
          ? Math.max(...usuarios.map(u => u.idUsuario)) + 1
          : 1;
      const nextIdEndereco =
        enderecos.length > 0
          ? Math.max(...enderecos.map(e => e.idEndereco)) + 1
          : 1;

      const usuarioNovo = {
        ...usuario,
        idUsuario: nextIdUsuario,
      };

      const enderecoNovo = {
        ...endereco,
        idEndereco: nextIdEndereco,
        idUsuario: nextIdUsuario,
      };

      const pedidoNovo = {
        ...pedido,
        idPedido: nextIdPedido,
        idCliente: nextIdUsuario,
        idEndereco: nextIdEndereco,
      };

      setUsuarios(prev => [...prev, usuarioNovo]);
      setEnderecos(prev => [...prev, enderecoNovo]);
      setPedidos(prev => [...prev, pedidoNovo]);
    }

    setShowModal(false);
    setPedidoSelecionado(null);
    setUsuarioSelecionado(null);
    setEnderecoSelecionado(null);
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setPedidoSelecionado(null);
    setUsuarioSelecionado(null);
    setEnderecoSelecionado(null);
  };
  const handleDeletePedido = async (idPedido) => {
    try {
      await axios.delete(`${API_BASE_URL}/pedido/${idPedido}`);

      setPedidos((prev) =>
        prev.filter((p) => p.idPedido !== idPedido)
      );
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
    }
  };

  return (
    <div className='Container'>
      <PedidoModal
        isOpen={showModal}
        onClose={handleFecharModal}
        onConfirm={handleConfirmarModal}
        pedido={pedidoSelecionado}
        usuario={usuarioSelecionado}
        endereco={enderecoSelecionado}
        modo={modoModal}
      />

      <NavBarAdmin />

      <div className='ContentCategorias'>
        <div className='TopContentCategorias'>
          <img src="/src/assets/Avatar.svg" alt='Avatar' />
          <button className="ButtonAdmin">Admin</button>
          <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
        </div>

        <PedidosTable
          pedidos={pedidos}
          onEditarPedido={handleAbrirModalEditar}
          onDeletePedido={handleDeletePedido}
        />

        <button
          className="ButtonAdmin"
          onClick={handleAbrirModalCadastrar}
        >
          Cadastrar Pedido
        </button>
      </div>
    </div>
  );
}

export default Pedidos;
