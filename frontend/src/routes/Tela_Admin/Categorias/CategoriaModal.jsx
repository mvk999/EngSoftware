import React, { useState, useEffect } from 'react';
import '../../Tela_Admin/Produto/Produto.css';
import EditIcon from '@mui/icons-material/Edit';

function CategoriaModal({ isOpen, onClose, onConfirm, categoria = null, modo = 'editar' }) {
  const [formData, setFormData] = useState({ id: '', nome: '' });

  useEffect(() => {
    if (isOpen) {
      setFormData({ id: categoria?.id ?? '', nome: categoria?.nome ?? '' });
    } else {
      setFormData({ id: '', nome: '' });
    }
  }, [isOpen, categoria]);

  const handleChange = (e) => setFormData((p) => ({ ...p, nome: e.target.value }));

  const handleConfirm = () => {
    if (!formData.nome || !formData.nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    const payload = { nome: formData.nome };
    if (modo === 'editar') payload.id = formData.id;
    onConfirm(payload);
  };

  const handleCancel = () => {
    setFormData({ id: '', nome: '' });
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="prod-modal-overlay" onClick={handleCancel}>
      <div className="prod-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="prod-modal-header">
          <div className="prod-modal-icon">
            <EditIcon style={{ color: '#FFC831' }} />
          </div>

          <div className="prod-modal-text">
            <h1 className="prod-modal-title">{modo === 'editar' ? 'Editar Categoria' : 'Cadastrar Categoria'}</h1>
          </div>

          <button className="prod-modal-close-btn" onClick={handleCancel} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="prod-modal-inputs">
          {modo === 'editar' ? (
            <div className="prod-input-field">
              <label className="prod-input-label">ID</label>
              <input type="text" className="prod-input" value={formData.id} disabled />
            </div>
          ) : null}

          <div className="prod-input-field">
            <label className="prod-input-label">Nome</label>
            <input type="text" className="prod-input" value={formData.nome} onChange={handleChange} />
          </div>
        </div>

        <div className="prod-modal-actions">
          <button className="prod-btn-confirm" onClick={handleConfirm}>{modo === 'editar' ? 'Salvar' : 'Cadastrar'}</button>
          <button className="prod-btn-cancel" onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default CategoriaModal;
