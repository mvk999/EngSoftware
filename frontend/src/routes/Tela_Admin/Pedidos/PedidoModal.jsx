import React, { useState, useEffect } from 'react';
import '../Produto/ProdutoModal.css';
import EditIcon from '@mui/icons-material/Edit';

function PedidoModal({
  isOpen,
  onClose,
  onConfirm,
  pedido = null,
  usuario = null,
  endereco = null,
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

  const [usuarioForm, setUsuarioForm] = useState({
    idUsuario: '',
    nome: '',
    email: '',
    cpf: '',
    tipo: '',
  });

  const [enderecoForm, setEnderecoForm] = useState({
    idEndereco: '',
    idUsuario: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
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

      const u = usuario ?? pedido?.cliente ?? {};
      const getUserVal = (o, ...keys) => {
        for (const k of keys) if (o?.[k] !== undefined) return o[k];
        return undefined;
      };
      setUsuarioForm({
        idUsuario: getUserVal(u, 'idUsuario', 'id_usuario', 'id') ?? '',
        nome: getUserVal(u, 'nome', 'name') ?? '',
        email: getUserVal(u, 'email') ?? '',
        cpf: getUserVal(u, 'cpf') ?? '',
        tipo: getUserVal(u, 'tipo') ?? 'CLIENTE',
      });

      const e = endereco ?? pedido?.endereco ?? {};
      const getEndVal = (o, ...keys) => {
        for (const k of keys) if (o?.[k] !== undefined) return o[k];
        return undefined;
      };
      setEnderecoForm({
        idEndereco: getEndVal(e, 'idEndereco', 'id_endereco', 'id') ?? '',
        idUsuario: getEndVal(e, 'idUsuario', 'id_usuario', 'usuarioId') ?? getEndVal(usuario, 'idUsuario', 'id') ?? '',
        rua: getEndVal(e, 'rua', 'logradouro', 'street') ?? '',
        numero: getEndVal(e, 'numero', 'number') ?? '',
        bairro: getEndVal(e, 'bairro') ?? '',
        cidade: getEndVal(e, 'cidade', 'city') ?? '',
        estado: getEndVal(e, 'estado', 'state') ?? '',
        cep: getEndVal(e, 'cep', 'zip', 'zipcode') ?? '',
      });
    }
  }, [isOpen, pedido, usuario, endereco]);

  const changePedido = (field) => (e) =>
    setPedidoForm((prev) => ({ ...prev, [field]: e.target.value }));

  const changeUsuario = (field) => (e) =>
    setUsuarioForm((prev) => ({ ...prev, [field]: e.target.value }));

  const changeEndereco = (field) => (e) =>
    setEnderecoForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleConfirm = () => {
    const safeNumber = (v) => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };

    const idPedidoVal = safeNumber(pedidoForm.idPedido) ?? safeNumber(pedido?.idPedido);
    const idClienteVal = safeNumber(pedidoForm.clienteId) ?? safeNumber(usuarioForm.idUsuario) ?? safeNumber(pedido?.idCliente) ?? safeNumber(pedido?.cliente?.idUsuario);
    const idEnderecoVal = safeNumber(pedidoForm.enderecoId) ?? safeNumber(enderecoForm.idEndereco) ?? safeNumber(pedido?.enderecoId) ?? safeNumber(pedido?.endereco?.idEndereco);
    const idUsuarioVal = safeNumber(usuarioForm.idUsuario) ?? safeNumber(usuario?.idUsuario) ?? safeNumber(pedido?.cliente?.idUsuario);

    const payload = {
      modo,
      pedido: {
        ...pedido,
        ...pedidoForm,
        idPedido: idPedidoVal,
        idCliente: idClienteVal,
        idEndereco: idEnderecoVal,
        valorTotal: safeNumber(pedidoForm.valorTotal) ?? safeNumber(pedido?.valorTotal) ?? 0,
      },
      usuario: {
        ...usuario,
        ...usuarioForm,
        idUsuario: idUsuarioVal,
      },
      endereco: {
        ...endereco,
        ...enderecoForm,
        idEndereco: idEnderecoVal,
        idUsuario: safeNumber(enderecoForm.idUsuario) ?? idUsuarioVal,
      },
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

          {/* ID Cliente is managed in the Usuario section to avoid duplication */}

          {/* ID Endereço moved to Endereço section to avoid duplication */}

          <div className="prod-input-field">
            <label className="prod-input-label">Data do Pedido</label>
            <input
              className="prod-input"
              value={pedidoForm.dataPedido}
              onChange={changePedido('dataPedido')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Status</label>
            <input
              type="text"
              className="prod-input"
              placeholder='Ex.: "Aguardando", "Cancelado"'
              value={pedidoForm.status}
              onChange={changePedido('status')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Valor Total</label>
            <input
              type="number"
              step="0.01"
              className="prod-input"
              placeholder="0.00"
              value={pedidoForm.valorTotal}
              onChange={changePedido('valorTotal')}
            />
          </div>

          {/* Seção Usuário */}
          <h3 className="prod-input-label" style={{ marginTop: '16px' }}>Dados do Cliente (Usuários)</h3>

          <div className="prod-input-field">
            <label className="prod-input-label">ID Usuário</label>
            <input
              type="number"
              className="prod-input"
              value={usuarioForm.idUsuario}
              onChange={changeUsuario('idUsuario')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Nome</label>
            <input
              type="text"
              className="prod-input"
              value={usuarioForm.nome}
              onChange={changeUsuario('nome')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Email</label>
            <input
              type="email"
              className="prod-input"
              value={usuarioForm.email}
              onChange={changeUsuario('email')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">CPF</label>
            <input
              type="text"
              className="prod-input"
              value={usuarioForm.cpf}
              onChange={changeUsuario('cpf')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Tipo</label>
            <input
              type="text"
              className="prod-input"
              placeholder="CLIENTE ou ADMIN"
              value={usuarioForm.tipo}
              onChange={changeUsuario('tipo')}
            />
          </div>

          {/* Seção Endereço */}
          <h3 className="prod-input-label" style={{ marginTop: '16px' }}>Endereço de Entrega</h3>
          <div className="prod-input-field">
            <label className="prod-input-label">ID Endereço</label>
            <input
              type="number"
              className="prod-input"
              value={enderecoForm.idEndereco}
              onChange={changeEndereco('idEndereco')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Rua</label>
            <input
              type="text"
              className="prod-input"
              value={enderecoForm.rua}
              onChange={changeEndereco('rua')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Número</label>
            <input
              type="text"
              className="prod-input"
              value={enderecoForm.numero}
              onChange={changeEndereco('numero')}
            />
          </div>

          {/* Complemento removed - not in DB schema */}

          <div className="prod-input-field">
            <label className="prod-input-label">Bairro</label>
            <input
              type="text"
              className="prod-input"
              value={enderecoForm.bairro}
              onChange={changeEndereco('bairro')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Cidade</label>
            <input
              type="text"
              className="prod-input"
              value={enderecoForm.cidade}
              onChange={changeEndereco('cidade')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Estado</label>
            <input
              type="text"
              className="prod-input"
              value={enderecoForm.estado}
              onChange={changeEndereco('estado')}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">CEP</label>
            <input
              type="text"
              className="prod-input"
              value={enderecoForm.cep}
              onChange={changeEndereco('cep')}
            />
          </div>
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
