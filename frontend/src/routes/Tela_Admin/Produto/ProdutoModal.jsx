import React, { useState, useEffect } from "react";
import "./ProdutoModal.css";
import EditIcon from "@mui/icons-material/Edit";

function ProdutoModal({
  isOpen,
  onClose,
  onConfirm,
  produto = null,
  listaCategorias = [],
  modo = "editar",
}) {
  const [formData, setFormData] = useState({
    id: "",
    idCategoria: "",
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: produto?.id ?? "",
        idCategoria: produto?.idCategoria ?? "",
        nome: produto?.nome ?? "",
        descricao: produto?.descricao ?? "",
        preco: produto?.preco ?? "",
        estoque: produto?.estoque ?? "",
      });
    } else {
      resetForm();
    }
  }, [isOpen, produto]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      idCategoria: "",
      nome: "",
      descricao: "",
      preco: "",
      estoque: "",
    });
  };

  const handleConfirm = () => {
    if (!formData.nome.trim() || !formData.idCategoria) {
      alert("Preencha o Nome e selecione uma Categoria.");
      return;
    }

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: formData.preco,
      estoque: formData.estoque,
      idCategoria: formData.idCategoria,
    };

    // Só envia ID no modo editar
    if (modo === "editar") {
      payload.id = formData.id;
    }

    onConfirm(payload);
  };

  const handleCancel = () => {
    resetForm();
    onClose && onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="prod-modal-overlay" data-testid="prod-modal-overlay" onClick={handleCancel}>
      <div className="prod-modal-content" data-testid="prod-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="prod-modal-header">
          <div className="prod-modal-icon">
            <EditIcon style={{ color: "#FFC831" }} />
          </div>

          <div className="prod-modal-text">
            <h1 className="prod-modal-title">
              {modo === "editar" ? "Editar Produto" : "Cadastrar Produto"}
            </h1>
          </div>

          <button
            className="prod-modal-close-btn"
            data-testid="prod-btn-close"
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

        {/* Campos */}
        <div className="prod-modal-inputs">

          {/* ID só é exibido no editar */}
          {modo === "editar" ? (
            <div className="prod-input-field">
              <label className="prod-input-label">ID</label>
              <input
                id="prod-id"
                data-testid="prod-input-id"
                type="text"
                className="prod-input"
                value={formData.id}
                disabled
              />
            </div>
          ) : null}

          <div className="prod-input-field">
            <label className="prod-input-label">Categoria</label>
            <select
              id="prod-select-categoria"
              data-testid="prod-select-categoria"
              className="prod-input"
              value={String(formData.idCategoria)}
              onChange={handleChange("idCategoria")}
            >
              <option value="">Selecione...</option>
              {listaCategorias.map((cat) => (
                <option 
                    key={cat.id ?? cat.idCategoria ?? cat.id_categoria ?? cat.ID}
                    value={cat.id ?? cat.idCategoria ?? cat.id_categoria ?? cat.ID}
                  >
                    {cat.nome ?? cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Nome</label>
            <input
              id="prod-input-nome"
              data-testid="prod-input-nome"
              type="text"
              className="prod-input"
              value={formData.nome}
              onChange={handleChange("nome")}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Descrição</label>
            <textarea
              id="prod-input-descricao"
              data-testid="prod-input-descricao"
              className="prod-input"
              rows={3}
              value={formData.descricao}
              onChange={handleChange("descricao")}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Preço</label>
            <input
              id="prod-input-preco"
              data-testid="prod-input-preco"
              type="number"
              className="prod-input"
              value={formData.preco}
              onChange={handleChange("preco")}
            />
          </div>

          <div className="prod-input-field">
            <label className="prod-input-label">Estoque</label>
            <input
              id="prod-input-estoque"
              data-testid="prod-input-estoque"
              type="number"
              className="prod-input"
              value={formData.estoque}
              onChange={handleChange("estoque")}
            />
          </div>
        </div>

        <div className="prod-modal-actions">
          <button className="prod-btn-confirm" data-testid="prod-btn-confirm" onClick={handleConfirm}>
            {modo === "editar" ? "Salvar" : "Cadastrar"}
          </button>
          <button className="prod-btn-cancel" data-testid="prod-btn-cancel" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProdutoModal;
