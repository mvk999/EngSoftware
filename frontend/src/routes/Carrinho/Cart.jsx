import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'
import axios from 'axios'
import { getToken } from '../../utils/auth'

const API_BASE_URL = 'http://localhost:3000'

export default function Cart() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverValorTotal, setServerValorTotal] = useState(null)
  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    async function fetchCart() {
      setLoading(true)
      setError(null)
      try {
          const token = getToken()
          const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {}

          const resp = await axios.get(`${API_BASE_URL}/carrinho`, config)
          // Normalize items: ensure preco is Number and idProduto exists if provided
          const raw = resp.data?.itens ?? resp.data ?? []
          // helper: parse price-like values robustly (strings with comma or currency symbols)
          const parsePrice = (v) => {
            if (v === undefined || v === null) return 0
            if (typeof v === 'number') return v
            const s = String(v).trim()
            if (s === '') return 0
            // replace comma decimal with dot and strip non-numeric chars except dot and minus
            const cleaned = s.replace(/\./g, '').replace(',', '.').replace(/[^0-9.\-]/g, '')
            const n = Number(cleaned)
            return Number.isNaN(n) ? 0 : n
          }

          let normalized = raw.map((it) => {
            // support shapes where product info may be nested inside `produto`, `product` or other variants
            const prodObj = it.produto ?? it.product ?? it.produto_id ?? it.prod ?? {}

            // gather many possible id candidates (flat and nested, camel/snake)
            const idCandidates = [
              it.idProduto,
              it.id,
              it.id_produto,
              it.produtoId,
              it.produto_id,
              it.produto?.id_produto,
              it.produto?.idProduto,
              it.produto?.id,
              it.product?.id_produto,
              it.product?.id,
              prodObj?.id_produto,
              prodObj?.idProduto,
              prodObj?.id,
              prodObj?.produto_id,
              // some APIs nest under 'produto' as an object with 'produto' key
              (it.produto && typeof it.produto === 'object' && (it.produto.id_produto ?? it.produto.id))
            ].filter(v => v !== undefined)

            // find first non-empty candidate
            let chosen = null
            for (const c of idCandidates) {
              if (c === null || c === undefined) continue
              // if candidate is object, try to find nested id
              if (typeof c === 'object') {
                const nested = c.id ?? c.id_produto ?? c.produto_id ?? c.idProduto
                if (nested != null) { chosen = nested; break }
                continue
              }
              if (String(c).trim() !== '') { chosen = c; break }
            }

            // normalize chosen id: treat 0 or negative as invalid
            if (chosen != null) {
              const chosenNum = Number(chosen)
              if (!Number.isFinite(chosenNum) || chosenNum <= 0) {
                chosen = null
              } else {
                chosen = chosenNum
              }
            }

            // price and name may be on item or nested product
            const precoRaw = it.preco ?? prodObj?.preco ?? it.preco_unitario ?? it.precoUnitario
            const nome = it.nome ?? prodObj?.nome ?? prodObj?.titulo ?? it.nome_produto
            const quantidadeRaw = it.quantidade ?? it.qtd ?? it.quantidade_item ?? it.qtd_item
            const estoqueRaw = it.estoque ?? prodObj?.estoque ?? prodObj?.quantidade_disponivel

            const quantidadeVal = quantidadeRaw != null ? Math.max(1, Number(quantidadeRaw)) : 1

            const mapped = {
              ...it,
              nome,
              preco: parsePrice(precoRaw),
              idProduto: chosen == null ? null : Number(chosen),
              quantidade: quantidadeVal,
              estoque: estoqueRaw != null ? Number(estoqueRaw) : estoqueRaw,
            }

            // Resolve nome do arquivo de imagem vindo do backend e monta URL pública
            const imagemCandidates = [
              it.imagem,
              it.imagemUrl,
              it.imagem_url,
              it.imagem_nome,
              prodObj?.imagem,
              prodObj?.imagemUrl,
              prodObj?.imagem_url,
              prodObj?.imagem_nome,
              prodObj?.imagemFilename,
              prodObj?.filename
            ].filter(Boolean)

            if (imagemCandidates.length > 0) {
              const fname = imagemCandidates[0]
              // monta URL absoluta com base na API
              mapped.imagemUrl = `${API_BASE_URL}/uploads/${fname}`
            } else if (prodObj && (prodObj.imagem_full_url || prodObj.url)) {
              mapped.imagemUrl = prodObj.imagem_full_url || prodObj.url
            } else {
              mapped.imagemUrl = null
            }

            // helpful debug log per item to inspect what backend sent
            console.log('Carrinho item mapeado:', { rawItem: it, idCandidates, mapped })
            return mapped
          })
          // If some items came without a usable id (backend bug), try to resolve by fetching products
          try {
            const missing = normalized.filter(i => !Number.isFinite(i.idProduto) || Number(i.idProduto) <= 0)
            if (missing.length > 0) {
              const prodResp = await axios.get(`${API_BASE_URL}/produto`, config)
              const allProducts = Array.isArray(prodResp.data) ? prodResp.data : (prodResp.data?.produtos ?? [])
              // try to match by name (case-insensitive) or by price as fallback
              normalized = normalized.map(it => {
                if (Number.isFinite(it.idProduto)) return it
                const match = allProducts.find(p => {
                  const nomeP = (p.nome || '').toString().toLowerCase().trim()
                  const nomeI = (it.nome || '').toString().toLowerCase().trim()
                  const precoP = Number(p.preco || p.valor || 0)
                  const precoI = Number(it.preco || 0)
                  if (nomeP && nomeI && nomeP === nomeI) return true
                  if (!nomeP && precoP && precoI && precoP === precoI) return true
                  return false
                })
                if (match) {
                  const resolved = Number(match.id_produto ?? match.id ?? match.idProduto)
                  if (Number.isFinite(resolved)) return { ...it, idProduto: resolved }
                }
                return it
              })
            }
          } catch (e) {
            console.warn('Não foi possível resolver ids faltantes do carrinho:', e)
          }

          // For items that have an idProduto > 0 but are missing product details (name/price), try fetching product details individually
          try {
            // fetch product details for items that have a valid id but missing image/name/price
            const toFetch = normalized.filter(i => Number.isFinite(i.idProduto) && Number(i.idProduto) > 0 && (!i.imagemUrl || !i.nome || Number(i.preco) === 0))
            if (toFetch.length > 0) {
              // fetch details and return updates, but don't mutate original objects directly
              const updates = await Promise.all(toFetch.map(async (it) => {
                try {
                  const r = await axios.get(`${API_BASE_URL}/produto/${it.idProduto}`, config)
                  const p = r.data
                  // backend might return the product directly or wrapped
                  const prodObj = (p && typeof p === 'object') ? (p.produto ?? (Array.isArray(p) ? p[0] : p) ?? {}) : {}

                  const up = {}
                  if (!it.nome) up.nome = prodObj.nome || prodObj.name || it.nome
                  const precoVal = prodObj.preco ?? prodObj.valor ?? prodObj.price ?? prodObj.precoUnitario
                  if (precoVal !== undefined) up.preco = Number(precoVal || 0)
                  up.estoque = it.estoque ?? (prodObj.estoque ?? prodObj.quantidade ?? up.estoque)
                  const fname = prodObj.imagem ?? prodObj.imagemUrl ?? prodObj.imagem_nome ?? prodObj.imagem_url ?? prodObj.filename
                  if (fname) up.imagemUrl = `${API_BASE_URL}/uploads/${fname}`
                  return { idProduto: Number(it.idProduto), update: up }
                } catch (e) {
                  console.warn('Não foi possível buscar detalhes do produto id=', it.idProduto, e)
                  return null
                }
              }))

              const map = new Map()
              updates.filter(Boolean).forEach(u => map.set(Number(u.idProduto), u.update))
              if (map.size > 0) {
                normalized = normalized.map(it => {
                  const key = Number(it.idProduto)
                  if (map.has(key)) {
                    return { ...it, ...map.get(key) }
                  }
                  return it
                })
              }
            }
          } catch (e) {
            console.warn('Erro ao buscar detalhes dos produtos do carrinho:', e)
          }

          if (mounted) setItems(normalized)
          console.log('Carrinho normalizado:', normalized)
          // compute client-side subtotal for comparison/debug
          const computedTotal = normalized.reduce((s, p) => s + (Number(p.preco) || 0) * (Number(p.quantidade) || 0), 0)
          console.log('Carrinho - server raw response:', resp.data)
          console.log('Carrinho - computed total from items:', computedTotal)
          // Extract numeric total sent by server in a robust way.
          // Backend may return { itens: [...], valorTotal: 123.45 } or { itens: [...], total: 123.45 }
          // or sometimes return a raw number as resp.data. Avoid assigning arrays/objects.
          let serverVal = null
          const candidates = [resp.data?.valorTotal, resp.data?.valor_total, resp.data?.total, resp.data]
          for (const c of candidates) {
            if (c === undefined || c === null) continue
            const n = Number(c)
            if (!Number.isNaN(n)) { serverVal = n; break }
          }
          if (mounted) {
            setServerValorTotal(Number.isFinite(serverVal) ? serverVal : null)
            if (Number.isFinite(serverVal) && Math.abs(serverVal - computedTotal) > 0.001) {
              console.warn('Server total differs from computed items total', { serverVal, computedTotal })
            }
          }
      } catch (err) {
        console.error('Erro carregando carrinho', err)
        setError('Não foi possível carregar o carrinho')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCart()
    return () => {
      mounted = false
    }
  }, [])

  // consider id valid only when normalized numeric idProduto exists and > 0
  const hasAnyRawId = (item) => Number.isFinite(item?.idProduto) && Number(item.idProduto) > 0

  const updateQuantity = async (produtoId, novaQtd) => {
    try {
      const token = getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      await axios.put(`${API_BASE_URL}/carrinho/${produtoId}`, { quantidade: novaQtd }, config)
      setItems((prev) => prev.map(i => i.idProduto === produtoId ? { ...i, quantidade: novaQtd } : i))
    } catch (err) {
      console.error('Erro atualizando quantidade', err)
      const msg = err.response?.data?.message || err.response?.data?.erro || 'Erro ao atualizar quantidade'
      alert(msg)
    }
  }

  const removeItem = async (produtoId) => {
    if (!confirm('Remover item do carrinho?')) return
    try {
      const token = getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      await axios.delete(`${API_BASE_URL}/carrinho/${produtoId}`, config)
      setItems((prev) => prev.filter(i => i.idProduto !== produtoId))
    } catch (err) {
      console.error('Erro removendo item', err)
      const msg = err.response?.data?.message || err.response?.data?.erro || 'Erro ao remover item'
      alert(msg)
    }
  }

  // Prefer client-side computed total so UI updates immediately when items change.
  // `serverValorTotal` is kept as an informational fallback but should not block UI updates.
  const subtotal = items.reduce((s, p) => s + (Number(p.preco) || 0) * (Number(p.quantidade) || 0), 0)
  const total = subtotal
  return (
    <div className="cart-root">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-top">
            <button className="back-btn" onClick={() => navigate('/')}>‹ Continue as compras</button>
          </div>

          <h2 className="cart-title">Carrinho de Compras</h2>
          {loading ? (
            <div style={{color:'#CACACA'}}>Carregando...</div>
          ) : error ? (
            <div style={{color:'#f66'}}>{error}</div>
          ) : items.length === 0 ? (
            <div style={{color:'#CACACA', marginTop:20}}>Seu carrinho está vazio.</div>
          ) : (
            items.map((prod, idx) => {
              const pid = Number(prod.idProduto)
              const precoNum = Number(prod.preco) || 0
              return (
                  <div className="cart-item" key={Number.isFinite(pid) ? pid : `noid-${idx}`}>
                  <div className={"item-image" + (prod.imagemUrl ? '' : ' placeholder')}>
                    {prod.imagemUrl ? (
                      <img className="product-card__image" src={prod.imagemUrl} alt={prod.nome} />
                    ) : (
                      <div style={{width:130,height:130,display:'flex',alignItems:'center',justifyContent:'center',color:'#CACACA',fontWeight:700}}>
                        {/* placeholder vazio para evitar mostrar valores inesperados (ex.: '12') */}
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="6" width="18" height="13" rx="2" stroke="#CACACA" strokeWidth="1.2" fill="none" />
                          <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#CACACA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="item-body">
                    <div className="item-name">{prod.nome}</div>
                    <div className="item-controls">
                                <div className="qty-controls">
                                  <button disabled={!hasAnyRawId(prod)} onClick={() => {
                                    console.log('decrease click pid=', pid, 'currentQty=', prod.quantidade)
                                    const newQ = Math.max(1, Number(prod.quantidade) - 1)
                                    if (!hasAnyRawId(prod)) return
                                    updateQuantity(pid, newQ)
                                  }}>-</button>
                                  <div className="item-qty">{prod.quantidade}</div>
                                  <button disabled={!hasAnyRawId(prod)} onClick={() => {
                                    console.log('increase click pid=', pid, 'currentQty=', prod.quantidade)
                                    const next = Number(prod.quantidade) + 1
                                    if (!hasAnyRawId(prod)) return
                                    if (prod.estoque != null && next > Number(prod.estoque)) {
                                      alert(`Quantidade máxima disponível: ${prod.estoque}`)
                                      return
                                    }
                                    updateQuantity(pid, next)
                                  }}>+</button>
                                </div>
                      <div className="item-price">{precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </div>
                  </div>
                  <button className="item-trash" disabled={!hasAnyRawId(prod)} onClick={() => !hasAnyRawId(prod) ? alert('Produto sem id — operação não disponível.') : (console.log('remove click pid=', pid), removeItem(pid))}>🗑</button>
                </div>
              )
            })
          )}

        </div>

        <aside className="cart-right">
          <h3 className="right-title">Dados de Endereço</h3>
          <div className="card-field">
            <label>CEP</label>
            <input placeholder="00000-000" value={endereco.cep} onChange={e => setEndereco(prev => ({ ...prev, cep: e.target.value }))} />
          </div>

          <div className="two-cols">
            <div className="card-field">
              <label>Rua</label>
              <input placeholder="Nome da rua" value={endereco.rua} onChange={e => setEndereco(prev => ({ ...prev, rua: e.target.value }))} />
            </div>
            <div className="card-field">
              <label>Número</label>
              <input placeholder="Número" value={endereco.numero} onChange={e => setEndereco(prev => ({ ...prev, numero: e.target.value }))} />
            </div>
          </div>

          <div className="two-cols">
            <div className="card-field">
              <label>Bairro</label>
              <input placeholder="Bairro" value={endereco.bairro} onChange={e => setEndereco(prev => ({ ...prev, bairro: e.target.value }))} />
            </div>
          </div>

          <div className="two-cols">
            <div className="card-field">
              <label>Cidade</label>
              <input placeholder="Cidade" value={endereco.cidade} onChange={e => setEndereco(prev => ({ ...prev, cidade: e.target.value }))} />
            </div>
            <div className="card-field">
              <label>Estado</label>
              <input placeholder="UF" value={endereco.estado} onChange={e => setEndereco(prev => ({ ...prev, estado: e.target.value }))} />
            </div>
          </div>

          <div className="summary">
            <div className="summary-row total">
              <span>Total</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="checkout-row">
            <button className="buy-btn" disabled={submitting || items.length === 0} onClick={async () => {
              // validate required fields
              const required = ['rua','numero','bairro','cidade','estado','cep']
              for (const k of required) {
                if (!endereco[k] || String(endereco[k]).trim() === '') {
                  alert('Preencha todos os campos obrigatórios do endereço (CEP, Rua, Número, Bairro, Cidade, Estado).')
                  return
                }
              }
              setSubmitting(true)
              try {
                const token = getToken()
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
                // First: create endereco in backend (required by /pedido)
                const enderecoPayload = {
                  rua: endereco.rua,
                  numero: endereco.numero,
                  bairro: endereco.bairro,
                  cidade: endereco.cidade,
                  estado: endereco.estado,
                  cep: endereco.cep
                }
                const enderecoResp = await axios.post(`${API_BASE_URL}/endereco`, enderecoPayload, config)
                const enderecoCriado = enderecoResp.data
                console.log('enderecoResp.data =', enderecoCriado)
                // backend may return the created row directly or wrap it ({ endereco: {...} })
                const maybe = enderecoCriado?.endereco ?? enderecoCriado
                const id_endereco = maybe?.id_endereco ?? maybe?.id ?? maybe?.idEndereco ?? null
                if (!id_endereco) {
                  console.error('ID do endereco não encontrado na resposta', enderecoResp.data)
                  alert('Erro ao criar endereço: resposta inesperada do servidor. Verifique o console.')
                  return
                }

                // Then create pedido using enderecoId (send multiple keys to be compatible)
                const pedidoPayload = { enderecoId: id_endereco, endereco_id: id_endereco, id_endereco }
                console.log('Enviando pedidoPayload =', pedidoPayload)
                const pedidoResp = await axios.post(`${API_BASE_URL}/pedido`, pedidoPayload, config)
                console.log('pedidoResp =', pedidoResp.data)
                // Try to clear server cart (DELETE /carrinho) to keep client/backend in sync
                try { await axios.delete(`${API_BASE_URL}/carrinho`, config) } catch { /* ignore */ }
                setItems([])
                setServerValorTotal(null)
                alert('Pedido criado com sucesso!')
              } catch (err) {
                console.error('Erro criando pedido', err)
                const msg = err.response?.data?.message || err.response?.data?.erro || 'Erro ao finalizar compra'
                alert(msg)
              } finally {
                setSubmitting(false)
              }
            }}>{submitting ? 'Finalizando...' : 'Finalizar Compra →'}</button>
          </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
