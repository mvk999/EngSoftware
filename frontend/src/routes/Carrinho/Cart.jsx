import React, { useEffect, useState } from 'react'
import './Cart.css'
import axios from 'axios'
import { getToken } from '../../utils/auth'

const API_BASE_URL = 'http://localhost:3000'

export default function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          const raw = resp.data || []
          const normalized = raw.map((it, idx) => ({
            // keep original props, coerce preco to number
            ...it,
            preco: typeof it.preco === 'string' ? Number(it.preco) : Number(it.preco || 0),
            // accept different id shapes returned by backend (idProduto, id, id_produto)
            idProduto: it.idProduto ?? it.id ?? it.id_produto ?? null,
          }))
          if (mounted) setItems(normalized)
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

  const subtotal = items.reduce((s, p) => s + (Number(p.preco) || 0) * (Number(p.quantidade) || 0), 0)
  const total = subtotal 
  return (
    <div className="cart-root">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-top">
            <button className="back-btn">‹ Continue as compras</button>
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
              const pid = prod.idProduto ?? prod.id ?? null
              const precoNum = Number(prod.preco) || 0
              return (
                <div className="cart-item" key={pid ?? `noid-${idx}`}>
                  <div className="item-image placeholder">{prod.nome?.charAt(0) ?? '?'}</div>
                  <div className="item-body">
                    <div className="item-name">{prod.nome}</div>
                    <div className="item-controls">
                                <div className="qty-controls">
                                  <button disabled={pid == null} onClick={() => {
                                    const newQ = Math.max(1, Number(prod.quantidade) - 1)
                                    if (!pid) return
                                    updateQuantity(pid, newQ)
                                  }}>-</button>
                                  <div className="item-qty">{prod.quantidade}</div>
                                  <button disabled={pid == null} onClick={() => {
                                    const next = Number(prod.quantidade) + 1
                                    if (!pid) return
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
                  <button className="item-trash" disabled={pid == null} onClick={() => pid ? removeItem(pid) : alert('Produto sem id — operação não disponível.')}>🗑</button>
                </div>
              )
            })
          )}

        </div>

        <aside className="cart-right">
          <h3 className="right-title">Dados de Endereço</h3>

          <div className="card-field">
            <label>Nome do Destinatário</label>
            <input placeholder="Nome completo" />
          </div>

          <div className="card-field">
            <label>CEP</label>
            <input placeholder="00000-000" />
          </div>

          <div className="two-cols">
            <div className="card-field">
              <label>Rua</label>
              <input placeholder="Nome da rua" />
            </div>
            <div className="card-field">
              <label>Número</label>
              <input placeholder="Número" />
            </div>
          </div>

          <div className="two-cols">
            <div className="card-field">
              <label>Bairro</label>
              <input placeholder="Bairro" />
            </div>
            <div className="card-field">
              <label>Complemento</label>
              <input placeholder="Apto / Bloco (opcional)" />
            </div>
          </div>

          <div className="two-cols">
            <div className="card-field">
              <label>Cidade</label>
              <input placeholder="Cidade" />
            </div>
            <div className="card-field">
              <label>Estado</label>
              <input placeholder="UF" />
            </div>
          </div>

          <div className="summary">
            <div className="summary-row total">
              <span>Total</span>
              <span>R${total.toFixed(0)}</span>
            </div>
            <div className="checkout-row">
            <button className="buy-btn">Finalizar Compra →</button>
          </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
