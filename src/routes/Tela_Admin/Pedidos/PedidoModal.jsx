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
    idCliente: '',
    idEndereco: '',
    dataPedido: '',
    status: '',
    valorTotal: '',
  });

  const [usuarioForm, setUsuarioForm] = useState({
    idUsuario: '',
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    tipo: '',
  });

  const [enderecoForm, setEnderecoForm] = useState({
    idEndereco: '',
    idUsuario: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  useEffect(() => {
    if (isOpen) {
      setPedidoForm({
        idPedido: pedido?.idPedido ?? '',
        idCliente: pedido?.idCliente ?? '',
        idEndereco: pedido?.idEndereco ?? '',
        dataPedido: pedido?.dataPedido ?? '',
        status: pedido?.status ?? '',
        valorTotal:
          pedido?.valorTotal !== undefined && pedido?.valorTotal !== null
            ? String(pedido.valorTotal)
            : '',
      });

      setUsuarioForm({
        idUsuario: usuario?.idUsuario ?? '',
        nome: usuario?.nome ?? '',
        email: usuario?.email ?? '',
        cpf: usuario?.cpf ?? '',
        senha: usuario?.senha ?? '',
        tipo: usuario?.tipo ?? 'CLIENTE',
      });

      setEnderecoForm({
        idEndereco: endereco?.idEndereco ?? '',
        idUsuario: endereco?.idUsuario ?? usuario?.idUsuario ?? '',
        logradouro: endereco?.logradouro ?? '',
        numero: endereco?.numero ?? '',
        complemento: endereco?.complemento ?? '',
        bairro: endereco?.bairro ?? '',
        cidade: endereco?.cidade ?? '',
        estado: endereco?.estado ?? '',
        cep: endereco?.cep ?? '',
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
    const payload = {
      modo,
      pedido: {
        ...pedido,
        ...pedidoForm,
        idPedido: pedidoForm.idPedido
          ? Number(pedidoForm.idPedido)
          : pedido?.idPedido,
        idCliente: Number(pedidoForm.idCliente || usuarioForm.idUsuario),
        idEndereco: Number(
          pedidoForm.idEndereco || enderecoForm.idEndereco,
        ),
        valorTotal: Number(pedidoForm.valorTotal || 0),
      },
      usuario: {
        ...usuario,
        ...usuarioForm,
        idUsuario: usuarioForm.idUsuario
          ? Number(usuarioForm.idUsuario)
          : usuario?.idUsuario,
      },
      endereco: {
        ...endereco,
        ...enderecoForm,
        idEndereco: enderecoForm.idEndereco
          ? Number(enderecoForm.idEndereco)
          : endereco?.idEndereco,
        idUsuario: enderecoForm.idUsuario
          ? Number(enderecoForm.idUsuario)
          : Number(usuarioForm.idUsuario || pedidoForm.idCliente),
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
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <EditIcon style={{ color: '#FFC831' }} />
          </div>
          <div className="modal-text-wrapper">
            <h1 className="modal-title">{titulo}</h1>
          </div>
          <button className="modal-close-btn" onClick={handleCancel} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Seção Pedido */}
        <div className="modal-input-section">
          <h3 className="input-label">Dados do Pedido</h3>

          <div className="input-field">
            <label className="input-label">ID Pedido</label>
            <input
              type="text"
              className="input-box"
              placeholder="(gerado pelo sistema)"
              value={pedidoForm.idPedido}
              onChange={changePedido('idPedido')}
              disabled={modo === 'editar'}
            />
          </div>

          <div className="input-field">
            <label className="input-label">ID Cliente (FK)</label>
            <input
              type="number"
              className="input-box"
              value={pedidoForm.idCliente}
              onChange={changePedido('idCliente')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">ID Endereço (FK)</label>
            <input
              type="number"
              className="input-box"
              value={pedidoForm.idEndereco}
              onChange={changePedido('idEndereco')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Data do Pedido</label>
            <input
              type="datetime-local"
              className="input-box"
              value={pedidoForm.dataPedido}
              onChange={changePedido('dataPedido')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Status</label>
            <input
              type="text"
              className="input-box"
              placeholder='Ex.: "Aguardando", "Cancelado"'
              value={pedidoForm.status}
              onChange={changePedido('status')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Valor Total</label>
            <input
              type="number"
              step="0.01"
              className="input-box"
              placeholder="0.00"
              value={pedidoForm.valorTotal}
              onChange={changePedido('valorTotal')}
            />
          </div>

          {/* Seção Usuário */}
          <h3 className="input-label" style={{ marginTop: '16px' }}>Dados do Cliente (Usuários)</h3>

          <div className="input-field">
            <label className="input-label">ID Usuário</label>
            <input
              type="number"
              className="input-box"
              value={usuarioForm.idUsuario}
              onChange={changeUsuario('idUsuario')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Nome</label>
            <input
              type="text"
              className="input-box"
              value={usuarioForm.nome}
              onChange={changeUsuario('nome')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-box"
              value={usuarioForm.email}
              onChange={changeUsuario('email')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">CPF</label>
            <input
              type="text"
              className="input-box"
              value={usuarioForm.cpf}
              onChange={changeUsuario('cpf')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Tipo</label>
            <input
              type="text"
              className="input-box"
              placeholder="CLIENTE ou ADMIN"
              value={usuarioForm.tipo}
              onChange={changeUsuario('tipo')}
            />
          </div>

          {/* Seção Endereço */}
          <h3 className="input-label" style={{ marginTop: '16px' }}>Endereço de Entrega</h3>

          <div className="input-field">
            <label className="input-label">ID Endereço</label>
            <input
              type="number"
              className="input-box"
              value={enderecoForm.idEndereco}
              onChange={changeEndereco('idEndereco')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">ID Usuário</label>
            <input
              type="number"
              className="input-box"
              value={enderecoForm.idUsuario}
              onChange={changeEndereco('idUsuario')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Logradouro</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.logradouro}
              onChange={changeEndereco('logradouro')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Número</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.numero}
              onChange={changeEndereco('numero')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Complemento</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.complemento}
              onChange={changeEndereco('complemento')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Bairro</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.bairro}
              onChange={changeEndereco('bairro')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Cidade</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.cidade}
              onChange={changeEndereco('cidade')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Estado</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.estado}
              onChange={changeEndereco('estado')}
            />
          </div>

          <div className="input-field">
            <label className="input-label">CEP</label>
            <input
              type="text"
              className="input-box"
              value={enderecoForm.cep}
              onChange={changeEndereco('cep')}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={handleConfirm} type="button">
            {botaoTexto}
          </button>
          <button className="btn-cancel" onClick={handleCancel} type="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoModal;
