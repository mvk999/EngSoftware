import React from 'react'
import './Cart.css'

export default function AddressSelector({ addresses = [], selectedId = null, onSelect }) {
  if (!addresses || addresses.length === 0) return null

  return (
    <div className="address-list">
      <h4 className="address-list-title">Endereços salvos</h4>
      <div className="address-grid">
        {addresses.map((a) => {
          const id = a.id_endereco ?? a.id ?? a.idEndereco
          const selected = selectedId && Number(selectedId) === Number(id)
          return (
              <div key={id ?? Math.random()} id={id ? `card-address-${id}` : undefined} className={"address-card" + (selected ? ' selected' : '')}>
              <div className="address-lines">
                <div className="addr-line"><strong>{a.rua}</strong>, {a.numero}</div>
                <div className="addr-line">{a.bairro} — {a.cidade}/{a.estado}</div>
                <div className="addr-line">CEP: {a.cep}</div>
              </div>
              <div className="address-actions">
                  <button id={id ? `btn-select-address-${id}` : undefined} className="select-addr-btn" onClick={() => onSelect(a)}>{selected ? 'Selecionado' : 'Selecionar'}</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
