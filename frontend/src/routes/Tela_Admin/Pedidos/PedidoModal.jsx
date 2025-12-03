import React, { useState, useEffect } from 'react';
import '../Produto/ProdutoModal.css';
import EditIcon from '@mui/icons-material/Edit';

function PedidoModal({
  isOpen,
  onClose,
  onConfirm,
  pedido = null,
  modo = 'editar',
}) {
  const [pedidoForm, setPedidoForm] = useState({
    idPedido: '',
    clienteId: '',
    enderecoId: '',
    dataPedido: '',
    status: '',
    valorTotal: '',
  });

  useEffect(() => {
    if (isOpen) {
      // normalize many possible shapes returned by API or parent
      const p = pedido || {};
      const getPedidoVal = (o, ...keys) => {
        for (const k of keys) if (o?.[k] !== undefined) return o[k];
        return undefined;
      };

      const resolvedIdPedido = getPedidoVal(p, 'idPedido', 'id_pedido', 'id');
      const resolvedClienteId = getPedidoVal(p, 'idCliente', 'id_cliente', 'clienteId') ?? getPedidoVal(p?.cliente, 'idUsuario', 'id_usuario', 'id');
      const resolvedEnderecoId = getPedidoVal(p, 'enderecoId', 'endereco_id', 'id_endereco') ?? getPedidoVal(p?.endereco, 'idEndereco', 'id_endereco', 'id');
      const resolvedData = getPedidoVal(p, 'dataPedido', 'data_pedido', 'data');
      const resolvedStatus = getPedidoVal(p, 'status', 'estado');
      const resolvedValor = getPedidoVal(p, 'valorTotal', 'valor_total', 'total');

      setPedidoForm({
        idPedido: resolvedIdPedido ?? '',
        clienteId: resolvedClienteId ?? '',
        enderecoId: resolvedEnderecoId ?? '',
        dataPedido: resolvedData ?? '',
        status: resolvedStatus ?? '',
        valorTotal: resolvedValor !== undefined && resolvedValor !== null ? String(resolvedValor) : '',
      });
    }
  }, [isOpen, pedido]);

  const changePedido = (field) => (e) =>
    setPedidoForm((prev) => ({ ...prev, [field]: e.target.value }));

  // only pedidoForm changes are needed

  const handleConfirm = () => {
    const safeNumber = (v) => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };

    const idPedidoVal = safeNumber(pedidoForm.idPedido) ?? safeNumber(pedido?.idPedido);
    const idClienteVal = safeNumber(pedidoForm.clienteId) ?? safeNumber(pedido?.idCliente) ?? safeNumber(pedido?.cliente?.id) ?? safeNumber(pedido?.cliente?.idUsuario);
    const idEnderecoVal = safeNumber(pedidoForm.enderecoId) ?? safeNumber(pedido?.enderecoId) ?? safeNumber(pedido?.id_endereco) ?? safeNumber(pedido?.endereco?.id);

    const payload = {
      modo,
      pedido: {
        ...pedido,
        ...pedidoForm,
        idPedido: idPedidoVal,
        valorTotal: safeNumber(pedidoForm.valorTotal) ?? safeNumber(pedido?.valorTotal) ?? 0,
      },
      clienteId: idClienteVal,
      enderecoId: idEnderecoVal,
    };

    onConfirm && onConfirm(payload);
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  if (!isOpen) return null;

  const titulo = modo === 'editar' ? 'Editar Pedido' : 'Cadastrar Pedido';
  const botaoTexto = modo === 'editar' ? 'Confirmar' : 'Cadastrar';

  return (
    <div className="prod-modal-overlay" onClick={handleCancel}>
      <div className="prod-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="prod-modal-header">
          <div className="prod-modal-icon">
            <EditIcon style={{ color: '#FFC831' }} />
          </div>
          <div className="prod-modal-text">
            <h1 className="prod-modal-title">{titulo}</h1>
          </div>
          <button className="prod-modal-close-btn" onClick={handleCancel} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Seção Pedido */}
        <div className="prod-modal-inputs">
          <h3 className="prod-input-label">Dados do Pedido</h3>

          <div className="prod-input-field">
            <label className="prod-input-label">ID Pedido</label>
            <input
              type="text"
              className="prod-input"
              placeholder="(gerado pelo sistema)"
              value={pedidoForm.idPedido}
              onChange={changePedido('idPedido')}
              disabled={modo === 'editar'}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">ID Cliente</label>
            <input
              type="number"
              className="prod-input"
              value={pedidoForm.clienteId}
              onChange={changePedido('clienteId')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">ID Endereço</label>
            <input
              type="number"
              className="prod-input"
              value={pedidoForm.enderecoId}
              onChange={changePedido('enderecoId')}
            />
          </div>


          <div className="prod-input-field">
            <label className="prod-input-label">Status</label>
            <select
              className="prod-input"
              value={pedidoForm.status}
              onChange={changePedido('status')}
            >
              <option value="">-- Selecione --</option>
              <option value="pendente">Pendente</option>
              <option value="processando">Processando</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
            </select>
          </div>

          {/* Usuário e Endereço removidos: o modal agora recebe apenas clienteId/enderecoId e dados do pedido */}
        </div>

        <div className="prod-modal-actions">
          <button className="prod-btn-confirm" onClick={handleConfirm} type="button">
            {botaoTexto}
          </button>
          <button className="prod-btn-cancel" onClick={handleCancel} type="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoModal;
