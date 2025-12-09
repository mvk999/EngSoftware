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
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('editar'); // 'editar' ou 'cadastrar'

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Pega token JWT do localStorage (configura Authorization header)
  const getConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Abrir modal para EDITAR pedido + cliente + endereço
  const handleAbrirModalEditar = (pedido) => {
    // prevent editing canceled orders
    const st = (pedido?.status ?? pedido?.estado ?? '')?.toString()?.toLowerCase();
    if (st === 'cancelado') {
      alert('Pedido cancelado não pode ser editado pelo admin.');
      return;
    }

    // tenta carregar detalhes completos do pedido via API
    const carregarDetalhes = async () => {
      try {
        const config = getConfig();
        const resp = await axios.get(`${API_BASE_URL}/pedido/${pedido.idPedido}`, config || {});
        const dados = resp.data || resp;
        setPedidoSelecionado(dados);
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
  // criação de pedidos não é permitida via admin UI — apenas edição

  // Confirmar modal: recebe pedido e apenas IDs de cliente/endereco
  const handleConfirmarModal = ({ pedido, clienteId, enderecoId, modo, itens, removerItens, endereco }) => {
    // integração com backend: PUT /pedido/{id} para editar, POST /pedido para criar
    const config = getConfig();
    (async () => {
      try {
        if (modo !== 'editar') {
          alert('Apenas edição de pedidos é permitida nesta tela.');
          return;
        }
        if (modo === 'editar') {
          const id = pedido.id || pedido.idPedido || pedido.id_pedido;

          const safeNumber = (v) => {
            if (v === undefined || v === null || v === '') return undefined;
            const n = Number(v);
            return Number.isNaN(n) ? undefined : n;
          };

          const payload = {};
          const clienteIdVal = safeNumber(clienteId) ?? safeNumber(pedido?.clienteId) ?? safeNumber(pedido?.idCliente) ?? safeNumber(pedido?.id_cliente);
          const enderecoIdVal = safeNumber(enderecoId) ?? safeNumber(pedido?.enderecoId) ?? safeNumber(pedido?.id_endereco) ?? safeNumber(pedido?.endereco?.id);
          if (clienteIdVal !== undefined) payload.clienteId = clienteIdVal;
          if (enderecoIdVal !== undefined) payload.enderecoId = enderecoIdVal;
          // include status and valorTotal if provided by the modal
          const statusVal = pedido?.status ?? pedido?.estado ?? pedido?.status;
          if (statusVal !== undefined && statusVal !== '') payload.status = statusVal;
          const valorTotalVal = safeNumber(pedido?.valorTotal ?? pedido?.valor_total ?? pedido?.total);
          if (valorTotalVal !== undefined) payload.valorTotal = valorTotalVal;

          // include itens and removerItens if modal provided them (either top-level or inside pedido)
          const itensFromModal = Array.isArray(itens) && itens.length > 0 ? itens : (Array.isArray(pedido?.itens) ? pedido.itens : [])
          const removerFromModal = Array.isArray(removerItens) && removerItens.length > 0 ? removerItens : (Array.isArray(pedido?.removerItens) ? pedido.removerItens : [])
          if (itensFromModal.length > 0) {
            payload.itens = itensFromModal.map(it => ({ idProduto: it.idProduto ?? it.id_produto ?? it.id, quantidade: it.quantidade }))
          }
          if (removerFromModal.length > 0) {
            payload.removerItens = removerFromModal.map(it => ({ idProduto: it.idProduto ?? it.id_produto ?? it.id }))
          }
          // include endereco object when present (admin edited address fields)
          const enderecoFromModal = endereco ?? pedido?.endereco ?? null
          if (enderecoFromModal) {
            payload.endereco = enderecoFromModal
          }

          // Send update and use returned object to update local state
          let resp = await axios.put(`${API_BASE_URL}/pedido/${id}`, payload, config || {});
          let updated = resp.data || {};

          // If backend returned only partial data (e.g., just ids), re-fetch the full pedido to get cliente/endereco details for the UI
          const lacksCliente = !updated.cliente || Object.keys(updated.cliente).length === 0
          const lacksEndereco = !updated.endereco || Object.keys(updated.endereco).length === 0
          if (lacksCliente || lacksEndereco) {
            try {
              const resp2 = await axios.get(`${API_BASE_URL}/pedido/${id}`, config || {});
              updated = resp2.data || updated;
            } catch (e) {
              console.warn('Não foi possível re-carregar pedido após atualização:', e.message)
            }
          }

          const mappedUpdated = {
            idPedido: updated.id_pedido ?? updated.id ?? updated.idPedido,
            idCliente: updated.id_cliente ?? updated.cliente?.id ?? updated.cliente?.id_usuario ?? updated.clienteId,
            idEndereco: updated.endereco?.id_endereco ?? updated.id_endereco ?? updated.endereco_id ?? updated.enderecoId,
            clienteNome: updated.cliente?.nome ?? '',
            enderecoResumo: updated.endereco ? `${updated.endereco.rua}, ${updated.endereco.numero}` : '',
            dataPedido: updated.data_pedido ?? updated.data ?? updated.dataPedido,
            status: updated.status,
            valorTotal: updated.valor_total ?? updated.valorTotal ?? 0,
            endereco: updated.endereco ?? null,
            cliente: updated.cliente ?? null,
            itens: updated.itens ?? []
          };

          setPedidos(prev => prev.map(p => (String(p.idPedido) === String(mappedUpdated.idPedido) ? { ...p, ...mappedUpdated } : p)));
        }

        setShowModal(false);
        setPedidoSelecionado(null);
      } catch (err) {
        console.error('Erro ao salvar pedido:', err);
        alert(err.response?.data?.erro || 'Erro ao salvar pedido.');
      }
    })();
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setPedidoSelecionado(null);
  };
  const handleDeletePedido = async (idPedido) => {
    try {
      const config = getConfig();
      await axios.delete(`${API_BASE_URL}/pedido/${idPedido}`, config || {});

      // mark pedido as canceled instead of removing it from list
      setPedidos((prev) => prev.map((p) => (String(p.idPedido) === String(idPedido) ? { ...p, status: 'cancelado' } : p)));
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
      alert(err.response?.data?.erro || 'Erro ao cancelar o pedido.');
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
              clienteEmail: p.cliente?.email ?? p.email_cliente ?? '',
              clienteCPF: p.cliente?.cpf ?? p.cpf_cliente ?? '',
              clienteTipo: p.cliente?.tipo ?? p.tipo_cliente ?? '',
              enderecoId: p.endereco?.id_endereco ?? p.id_endereco ?? p.endereco_id ?? null,
              enderecoUsuarioId: p.endereco?.id_usuario ?? p.endereco?.id_usuario ?? null,
              enderecoRua: p.endereco?.rua ?? p.rua ?? '',
              enderecoNumero: p.endereco?.numero ?? p.numero ?? '',
              enderecoBairro: p.endereco?.bairro ?? p.bairro ?? '',
              enderecoCidade: p.endereco?.cidade ?? p.cidade ?? '',
              enderecoEstado: p.endereco?.estado ?? p.estado ?? '',
              enderecoCEP: p.endereco?.cep ?? p.cep ?? '',
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

        {/* Botão de cadastro removido — criação não é permitida via admin UI */}
      </div>
    </div>
  );
}

export default Pedidos;
