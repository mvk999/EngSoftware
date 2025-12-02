import '../Produto/Produto.css';
import './Pedidos.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { isAdmin } from '../../../utils/auth';
import NavBarAdmin from '../NavBarAdmin';
import PedidosTable from './PedidosTable';
import PedidoModal from './PedidoModal';

const API_BASE_URL = 'http://localhost:3000';



function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar'); // 'editar' ou 'cadastrar'

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

  // Pega token JWT do localStorage (configura Authorization header)
  const getConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Abrir modal para EDITAR pedido + cliente + endereço
  const handleAbrirModalEditar = (pedido) => {
    // tenta carregar detalhes completos do pedido via API
    const carregarDetalhes = async () => {
      try {
        const config = getConfig();
        const resp = await axios.get(`${API_BASE_URL}/pedido/${pedido.idPedido}`, config || {});
        const dados = resp.data || resp;
        setPedidoSelecionado(dados);
        setUsuarioSelecionado(null);
        setEnderecoSelecionado(null);
        setModoModal('editar');
        setShowModal(true);
      } catch (err) {
        console.warn('Não foi possível carregar detalhes do pedido, abrindo com dados existentes', err.message);
        setPedidoSelecionado(pedido);
        setShowModal(true);
      }
    };

    carregarDetalhes();
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
    // integração com backend: PUT /pedido/{id} para editar, POST /pedido para criar
    const config = getConfig();
    (async () => {
      try {
        if (modo === 'editar') {
          const id = pedido.id || pedido.idPedido || pedido.id_pedido;
          const payload = {
            status: pedido.status,
            itens: (pedido.itens || []).map(i => ({ idProduto: i.idProduto || i.id_produto, quantidade: i.quantidade }))
          };
          await axios.put(`${API_BASE_URL}/pedido/${id}`, payload, config || {});
          setPedidos(prev => prev.map(p => (p.idPedido === (id) ? { ...p, ...payload, status: payload.status } : p)));
        } else {
          // cadastrar: backend espera { endereco_id }
          const enderecoId = endereco?.idEndereco || endereco?.id || endereco?.id_endereco;
          if (!enderecoId) {
            alert('Para criar um pedido é necessário selecionar um endereço.');
            return;
          }
          const resp = await axios.post(`${API_BASE_URL}/pedido`, { endereco_id: enderecoId }, config || {});
          const novo = resp.data;
          if (novo) {
            // mapear para idPedido
            const mapped = {
              idPedido: novo.id ?? novo.idPedido,
              idCliente: novo.id_cliente ?? novo.idCliente,
              idEndereco: novo.id_endereco ?? novo.endereco_id ?? novo.idEndereco,
              clienteNome: novo.cliente?.nome ?? novo.nome_cliente ?? '',
              enderecoResumo: novo.endereco ? `${novo.endereco.rua}, ${novo.endereco.numero}` : '',
              dataPedido: novo.data ?? novo.dataPedido,
              status: novo.status,
              valorTotal: novo.valorTotal ?? novo.valor_total ?? 0,
            };
            setPedidos(prev => [...prev, mapped]);
          } else {
            // recarrega lista
            const listResp = await axios.get(`${API_BASE_URL}/pedido`, config || {});
            const mapped = Array.isArray(listResp.data) ? listResp.data.map(p => ({
              idPedido: p.id_pedido ?? p.id,
              idCliente: p.id_cliente ?? p.idCliente,
              idEndereco: p.id_endereco ?? p.endereco_id ?? p.idEndereco,
              clienteNome: p.cliente?.nome ?? p.nome_cliente ?? '',
              enderecoResumo: p.endereco ? `${p.endereco.rua}, ${p.endereco.numero}` : (p.endereco_resumo ?? ''),
              dataPedido: p.data_pedido ?? p.data ?? p.dataPedido,
              status: p.status ?? 'Pendente',
              valorTotal: p.valor_total ?? p.valorTotal ?? 0,
            })) : [];
            setPedidos(mapped);
          }
        }

        setShowModal(false);
        setPedidoSelecionado(null);
        setUsuarioSelecionado(null);
        setEnderecoSelecionado(null);
      } catch (err) {
        console.error('Erro ao salvar pedido:', err);
        alert(err.response?.data?.erro || 'Erro ao salvar pedido.');
      }
    })();
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

      setPedidos((prev) => prev.filter((p) => p.idPedido !== idPedido));
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
    }
  };

  // carregar pedidos iniciais (se existir a API)
  useEffect(() => {
    // garante que apenas admin veja a tela
    if (!isAdmin()) {
      setAutorizado(false);
      setLoading(false);
      return;
    }

    const carregar = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`${API_BASE_URL}/pedido`, getConfig() || {});
        // mapear conforme o formato esperado pela tabela
        const mapped = Array.isArray(resp.data)
          ? resp.data.map((p) => ({
              idPedido: p.id_pedido ?? p.idPedido ?? p.id,
              idCliente: p.id_cliente ?? p.idCliente ?? p.id_cliente,
              idEndereco: p.id_endereco ?? p.endereco_id ?? p.idEndereco ?? p.id_endereco,
              clienteNome: p.cliente?.nome ?? p.nome_cliente ?? '',
              enderecoResumo: p.endereco ? `${p.endereco.rua}, ${p.endereco.numero}` : (p.endereco_resumo ?? ''),
              dataPedido: p.data_pedido ?? p.data ?? p.dataPedido,
              status: p.status ?? p.estado ?? 'Pendente',
              valorTotal: p.valor_total ?? p.total ?? p.valorTotal ?? 0,
            }))
          : [];
        setPedidos(mapped);
      } catch (err) {
        console.warn('Não foi possível carregar pedidos automaticamente:', err.message);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  if (!autorizado) {
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
      {/* Modal de criar/editar pedido */}
      <PedidoModal
        isOpen={showModal}
        onClose={handleFecharModal}
        onConfirm={handleConfirmarModal}
        pedido={pedidoSelecionado}
        usuario={usuarioSelecionado}
        endereco={enderecoSelecionado}
        modo={modoModal}
      />

      {/* Navbar que você já tem pronta */}
      <NavBarAdmin />

      {/* Mantendo as classes originais do layout de produtos */}
      <div className="prod-content-categorias">
        <div className="prod-top-content-categorias">
          <img src="/src/assets/Avatar.svg" alt="Avatar" />
          <button className="prod-button-admin">Admin</button>
          <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
        </div>

        {/* Tabela de pedidos (componente específico) */}
        <div className="PedidosWrapper">
          <PedidosTable
            pedidos={pedidos}
            onEditarPedido={handleAbrirModalEditar}
            onDeletePedido={handleDeletePedido}
          />
        </div>

        {/* Botão para abrir modal de cadastro */}
        <button
          className="prod-button-admin"
          onClick={handleAbrirModalCadastrar}
          style={{ marginTop: '20px' }}
        >
          Cadastrar Pedido
        </button>
      </div>
    </div>
  );
}

export default Pedidos;
