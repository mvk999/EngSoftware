import React, { useState, useEffect } from 'react';
import './ProdutoModal.css';
import EditIcon from '@mui/icons-material/Edit';

function ProdutoModal({
  isOpen,
  onClose,
  onConfirm,
  categoria = null,     // objeto completo da linha
  categoriaNome = '',   // compatibilidade com versão antiga (se vier só o nome)
  modo = 'editar',      // 'editar' ou 'cadastrar'
}) {
  const [formData, setFormData] = useState({
    id: '',
    idcategoria: '',
    name: '',
    descricao: '',
    preco: '',
    estoque: '',
  });

  // Preenche os campos sempre que abrir / trocar categoria
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: categoria?.id || '',
        idcategoria: categoria?.idcategoria || '',
        name: categoria?.name || categoriaNome || '',
        descricao: categoria?.descricao || '',
        preco: categoria?.preco || '',
        estoque:
          categoria?.estoque !== undefined && categoria?.estoque !== null
            ? String(categoria.estoque)
            : '',
      });
    }
  }, [isOpen, categoria, categoriaNome]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      idcategoria: '',
      name: '',
      descricao: '',
      preco: '',
      estoque: '',
    });
  };

  const handleConfirm = () => {
    if (!formData.name.trim()) return; // validação mínima

    const payload = {
      ...categoria, // preserva o que vier do row original
      ...formData,
      estoque:
        formData.estoque === '' ? 0 : Number(formData.estoque), // converte pra número
    };

    if (onConfirm) {
      onConfirm(payload);
    }

    if (modo === 'cadastrar') {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose && onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const titulo = modo === 'editar' ? 'Editar Produto' : 'Cadastrar Produto';
  const botaoTexto = modo === 'editar' ? 'Confirmar' : 'Cadastrar';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <EditIcon
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFC831',
              }}
            />
          </div>
          <div className="modal-text-wrapper">
            <h1 className="modal-title">{titulo}</h1>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleCancel}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#C4CDD5"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Inputs */}
        <div className="modal-input-section">
          <div className="input-field">
            <label className="input-label">ID</label>
            <input
              type="text"
              className="input-box"
              placeholder="#1"
              value={formData.id}
              onChange={handleChange('id')}
              onKeyDown={handleKeyPress}
              disabled={modo === 'cadastrar'} // <--- trava no cadastro
            />
          </div>

          <div className="input-field">
            <label className="input-label">ID-Categoria</label>
            <input
              type="text"
              className="input-box"
              placeholder="#C1"
              value={formData.idcategoria}
              onChange={handleChange('idcategoria')}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Nome</label>
            <input
              type="text"
              className="input-box"
              placeholder="Nome do Produto"
              value={formData.name}
              onChange={handleChange('name')}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Descrição</label>
            <textarea
              className="input-box"
              placeholder="Descrição do Produto"
              value={formData.descricao}
              onChange={handleChange('descricao')}
              onKeyDown={handleKeyPress}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Preço</label>
            <input
              type="text"
              className="input-box"
              placeholder="R$ 0,00"
              value={formData.preco}
              onChange={handleChange('preco')}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Estoque</label>
            <input
              type="number"
              className="input-box"
              placeholder="0"
              value={formData.estoque}
              onChange={handleChange('estoque')}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            type="button"
          >
            {botaoTexto}
          </button>
          <button
            className="btn-cancel"
            onClick={handleCancel}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProdutoModal;
