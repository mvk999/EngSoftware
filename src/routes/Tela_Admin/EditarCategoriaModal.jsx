import React, { useState, useEffect } from 'react';
import './CategoriaModal.css';
import EditIcon from '@mui/icons-material/Edit';

function EditarCategoriaModal({ isOpen, onClose, onConfirm, categoriaNome = '' }) {
  const [nome, setNome] = useState(categoriaNome);

  useEffect(() => {
    if (isOpen) {
      setNome(categoriaNome);
    }
  }, [isOpen, categoriaNome]);

  const handleConfirm = () => {
    if (nome.trim()) {
      onConfirm(nome);
      setNome('');
    }
  };

  const handleCancel = () => {
    setNome('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <EditIcon style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFC831',
            }}/>
          </div>
          <div className="modal-text-wrapper">
            <h1 className="modal-title">Editar Categoria</h1>
          </div>
          <button className="modal-close-btn" onClick={handleCancel} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Input Section */}
        <div className="modal-input-section">
          <div className="input-field">
            <label className="input-label">Nome</label>
            <input
              type="text"
              className="input-box"
              placeholder="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-confirm" onClick={handleConfirm} type="button">
            Confirmar
          </button>
          <button className="btn-cancel" onClick={handleCancel} type="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarCategoriaModal;