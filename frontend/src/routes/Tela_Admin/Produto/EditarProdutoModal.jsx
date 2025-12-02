import React, { useState, useEffect } from 'react';
import './ProdutoModal.css';
import EditIcon from '@mui/icons-material/Edit';

function EditarProdutoModal({ isOpen, onClose, onConfirm, categoriaNome = '' }) {
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
    <div className="prod-modal-overlay" data-testid="prod-edit-modal-overlay" onClick={handleCancel}>
      <div className="prod-modal-content" data-testid="prod-edit-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="prod-modal-header">
          <div className="prod-modal-icon">
            <EditIcon style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFC831',
            }}/>
          </div>
          <div className="prod-modal-text">
            <h1 className="prod-modal-title">Editar Produtos</h1>
          </div>
          <button className="prod-modal-close-btn" data-testid="prod-edit-btn-close" onClick={handleCancel} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Input Section */}
        <div className="prod-modal-inputs">
          <div className="prod-input-field">
            <label className="prod-input-label">Nome</label>
            <input
              id="prod-edit-input-nome"
              data-testid="prod-edit-input-nome"
              type="text"
              className="prod-input"
              placeholder="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          </div>
        </div>

        {/* Actions */}
        <div className="prod-modal-actions">
          <button className="prod-btn-confirm" data-testid="prod-edit-btn-confirm" onClick={handleConfirm} type="button">
            Confirmar
          </button>
          <button className="prod-btn-cancel" data-testid="prod-edit-btn-cancel" onClick={handleCancel} type="button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarProdutoModal;