import React, { useState, useEffect } from 'react';
import '../Produto/ProdutoModal.css';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { getToken } from '../../../utils/auth';


const API_BASE_URL = 'http://localhost:3000';

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
  const [addressMode, setAddressMode] = useState('selectOrEdit') // 'selectOrEdit' or 'edit'
  const [clienteEnderecos, setClienteEnderecos] = useState([])
  const [manualEnderecoId, setManualEnderecoId] = useState('')

  const [items, setItems] = useState([]) // itens do pedido: { idProduto, quantidade, nome, precoUnitario, remover }

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

      // normalize items from pedido
      const rawItens = pedido?.itens ?? pedido?.items ?? pedido?.itensPedido ?? []
      const mappedItems = Array.isArray(rawItens) ? rawItens.map(it => {
        // Use only nullish coalescing (??) to avoid mixing with || which is a syntax error
        const idProduto = it.idProduto ?? it.id_produto ?? it.id ?? it.produto_id ?? null
        const quantidade = it.quantidade ?? it.qtd ?? it.qtd_item ?? it.quantidade_item ?? 1
        const nome = it.nome ?? it.nome_produto ?? it.productName ?? (it.produto?.nome ?? '')
        const precoUnitario = (it.precoUnitario ?? it.preco_unitario ?? it.preco ?? it.precoUnit) ?? 0

        return {
          idProduto,
          quantidade,
          nome,
          precoUnitario,
          remover: false
        }
      }) : []
      setItems(mappedItems)

      // try to find client addresses inside payload (some backends include them)
      const possible = pedido?.cliente?.enderecos ?? pedido?.cliente?.addresses ?? pedido?.enderecos ?? pedido?.cliente?.enderecosUsuario
      if (Array.isArray(possible) && possible.length > 0) {
        setClienteEnderecos(possible)
      } else {
        setClienteEnderecos([])
        // if we have a cliente id, try admin endpoint to fetch addresses
        const resolvedClienteIdForFetch = resolvedClienteId ?? (pedido?.cliente?.idUsuario ?? pedido?.cliente?.id);
        if (resolvedClienteIdForFetch) {
          (async () => {
            try {
              const token = getToken();
              // route is under /endereco/admin/cliente/:id/enderecos
              const resp = await axios.get(`${API_BASE_URL}/endereco/admin/cliente/${resolvedClienteIdForFetch}/enderecos`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
              });
              if (Array.isArray(resp.data)) setClienteEnderecos(resp.data);
            } catch (err) {
              // backend may not have route yet; fail silently but keep UX usable
              console.warn('Não foi possível carregar endereços do cliente:', err?.response?.status || err.message);
              setClienteEnderecos([]);
            }
          })();
        }
      }
    }
  }, [isOpen, pedido]);

  const changePedido = (field) => (e) =>
    setPedidoForm((prev) => ({ ...prev, [field]: e.target.value }));

  // only pedidoForm changes are needed

  const handleConfirm = () => {
    // build itens payload and removerItens
    const itensPayload = items.filter(i => !i.remover).map(i => ({ idProduto: Number(i.idProduto), quantidade: Number(i.quantidade) }))
    const removerItens = items.filter(i => i.remover).map(i => ({ idProduto: Number(i.idProduto) }))

    const safeNumber = (v) => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };

    const idPedidoVal = safeNumber(pedidoForm.idPedido) ?? safeNumber(pedido?.idPedido);
    const idEnderecoVal = safeNumber(pedidoForm.enderecoId) ?? safeNumber(pedido?.enderecoId) ?? safeNumber(pedido?.id_endereco) ?? safeNumber(pedido?.endereco?.id);

    const payload = {
      modo,
      pedido: {
        ...pedido,
        ...pedidoForm,
        idPedido: idPedidoVal,
        valorTotal: safeNumber(pedidoForm.valorTotal) ?? safeNumber(pedido?.valorTotal) ?? 0,
      },
      // clienteId intentionally omitted: admins cannot change the cliente via this modal
      enderecoId: idEnderecoVal,
    };

    // attach items/removals if present
    if (itensPayload.length > 0) payload.itens = itensPayload
    if (removerItens.length > 0) payload.removerItens = removerItens

    // if admin chose an existing endereco by manual id, prefer it
    if (manualEnderecoId && String(manualEnderecoId).trim() !== '') {
      payload.enderecoId = Number(manualEnderecoId)
    }

    // if addressMode is 'edit', send 'endereco' object to update address fields
    if (addressMode === 'edit') {
      const enderecoObj = {
        // prefer values entered in the form (pedidoForm) over the original pedido.endereco
        rua: pedidoForm.rua ?? pedido?.endereco?.rua ?? '',
        numero: pedidoForm.numero ?? pedido?.endereco?.numero ?? '',
        bairro: pedidoForm.bairro ?? pedido?.endereco?.bairro ?? '',
        cidade: pedidoForm.cidade ?? pedido?.endereco?.cidade ?? '',
        estado: pedidoForm.estado ?? pedido?.endereco?.estado ?? '',
        cep: pedidoForm.cep ?? pedido?.endereco?.cep ?? ''
      };

      // ensure required fields are present (backend will validate too)
      payload.endereco = enderecoObj;
    }

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
          <button id="btn-pedido-close" className="prod-modal-close-btn" onClick={handleCancel} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Seção Pedido */}
        <div className="prod-modal-inputs">
          <h3 className="prod-input-label">Dados do Pedido</h3>

          <div className="prod-input-field">
            <label className="prod-input-label">Status</label>
            <select
              id="select-pedido-status"
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

          {/* Endereço: se houver lista de endereços do cliente, mostra select; caso contrário, permite editar ou informar ID manualmente */}
          <div className="prod-input-field">
            <label className="prod-input-label">Endereço do Pedido</label>
            {clienteEnderecos && clienteEnderecos.length > 0 ? (
              <>
                <select
                  id="select-pedido-endereco"
                  className="prod-input"
                  value={pedidoForm.enderecoId || ''}
                  onChange={(e) => { setPedidoForm(prev => ({ ...prev, enderecoId: e.target.value })); setManualEnderecoId('') }}
                >
                  <option value="">-- Usar endereço atual --</option>
                  {clienteEnderecos.map((a) => {
                    const id = a.id_endereco ?? a.id ?? a.idEndereco
                    const label = `${a.rua}, ${a.numero} — ${a.cidade}/${a.estado} (CEP ${a.cep || ''})`
                    return <option key={id} value={id}>{label}</option>
                  })}
                </select>
                <div style={{display:'flex',gap:8,marginTop:8}}>
                  <button id="btn-pedido-toggle-edit-endereco" type="button" className="prod-btn-cancel" onClick={() => setAddressMode(addressMode === 'edit' ? 'selectOrEdit' : 'edit')}>{addressMode === 'edit' ? 'Usar seleção' : 'Editar endereço'}</button>
                </div>
              </>
            ) : (
              <>
                <div style={{display:'flex',gap:8}}>
                  <button id="btn-pedido-open-edit-endereco" type="button" className="prod-btn-cancel" onClick={() => setAddressMode('edit')}>Editar endereço atual</button>
                  <input id="input-pedido-manual-enderecoId" className="prod-input" placeholder="Ou informe ID de endereço existente" value={manualEnderecoId} onChange={(e) => setManualEnderecoId(e.target.value)} />
                </div>
              </>
            )}
          </div>

          {/* Se admin escolher editar endereço, mostra campos para rua/numero/bairro/cidade/estado/cep */}
              {addressMode === 'edit' && (
            <>
              <div className="prod-input-field"><label className="prod-input-label">Rua</label><input id="input-pedido-rua" className="prod-input" value={pedidoForm.rua || (pedido?.endereco?.rua || '')} onChange={(e)=> setPedidoForm(prev=>({...prev, rua: e.target.value}))} /></div>
              <div className="prod-input-field"><label className="prod-input-label">Número</label><input id="input-pedido-numero" className="prod-input" value={pedidoForm.numero || (pedido?.endereco?.numero || '')} onChange={(e)=> setPedidoForm(prev=>({...prev, numero: e.target.value}))} /></div>
              <div className="prod-input-field"><label className="prod-input-label">Bairro</label><input id="input-pedido-bairro" className="prod-input" value={pedidoForm.bairro || (pedido?.endereco?.bairro || '')} onChange={(e)=> setPedidoForm(prev=>({...prev, bairro: e.target.value}))} /></div>
              <div className="prod-input-field"><label className="prod-input-label">Cidade</label><input id="input-pedido-cidade" className="prod-input" value={pedidoForm.cidade || (pedido?.endereco?.cidade || '')} onChange={(e)=> setPedidoForm(prev=>({...prev, cidade: e.target.value}))} /></div>
              <div className="prod-input-field"><label className="prod-input-label">Estado</label><input id="input-pedido-estado" className="prod-input" value={pedidoForm.estado || (pedido?.endereco?.estado || '')} onChange={(e)=> setPedidoForm(prev=>({...prev, estado: e.target.value}))} /></div>
              <div className="prod-input-field"><label className="prod-input-label">CEP</label><input id="input-pedido-cep" className="prod-input" value={pedidoForm.cep || (pedido?.endereco?.cep || '')} onChange={(e)=> setPedidoForm(prev=>({...prev, cep: e.target.value}))} /></div>
            </>
          )}

          {/* Itens do pedido: permite alterar quantidade e marcar remoção */}
          <div style={{width:'100%'}}>
            <h3 className="prod-input-label">Itens do Pedido</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
              {items.length === 0 ? (
                <div style={{color:'#C4CDD5'}}>Nenhum item encontrado neste pedido.</div>
              ) : (
                items.map((it, idx) => (
                  <div key={String(it.idProduto) + '-' + idx} style={{display:'flex',alignItems:'center',gap:10,background:'#131217',padding:10,borderRadius:8}}>
                      <div style={{flex:1}}>
                      <div style={{color:'#C4CDD5',fontWeight:600}}>{it.nome || `Produto ${it.idProduto}`}</div>
                      <div style={{color:'#9AA0A8',fontSize:13}}>Unit: {Number(it.precoUnitario).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <button id={`btn-pedido-decrease-${it.idProduto}-${idx}`} className="prod-btn-cancel" onClick={() => {
                        const clone = [...items];
                        const cur = Number(clone[idx].quantidade) || 1;
                        clone[idx].quantidade = Math.max(1, cur - 1);
                        setItems(clone);
                      }}>-</button>
                      <input id={`input-pedido-quantidade-${it.idProduto}-${idx}`} className="prod-input" style={{width:70,textAlign:'center'}} value={it.quantidade} onChange={(e)=>{
                        const val = Number(e.target.value) || 0; const clone = [...items]; clone[idx].quantidade = Math.max(0, val); setItems(clone)
                      }} />
                      <button id={`btn-pedido-increase-${it.idProduto}-${idx}`} className="prod-btn-confirm" onClick={() => { const clone = [...items]; const cur = Number(clone[idx].quantidade) || 1; clone[idx].quantidade = cur + 1; setItems(clone); }}>+</button>
                      <button id={`btn-pedido-toggle-remove-${it.idProduto}-${idx}`} className="prod-btn-cancel" onClick={() => { const clone = [...items]; clone[idx].remover = !clone[idx].remover; setItems(clone); }}>{it.remover ? 'Desfazer' : 'Remover'}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Usuário e Endereço removidos: o modal agora recebe apenas clienteId/enderecoId e dados do pedido */}
        </div>

        <div className="prod-modal-actions">
          <button id="btn-pedido-confirm" className="prod-btn-confirm" onClick={handleConfirm} type="button">
            {botaoTexto}
          </button>
          <button id="btn-pedido-cancel" className="prod-btn-cancel" onClick={handleCancel} type="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoModal;
