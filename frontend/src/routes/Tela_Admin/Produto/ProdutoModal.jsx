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
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <EditIcon style={{ color: "#FFC831" }} />
          </div>

          <div className="modal-text-wrapper">
            <h1 className="modal-title">
              {modo === "editar" ? "Editar Produto" : "Cadastrar Produto"}
            </h1>
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

        {/* Campos */}
        <div className="modal-input-section">

          {/* ID só é exibido no editar */}
          {modo === "editar" ? (
            <div className="input-field">
              <label className="input-label">ID</label>
              <input
                type="text"
                className="input-box"
                value={formData.id}
                disabled
              />
            </div>
          ) : null}

          <div className="input-field">
            <label className="input-label">Categoria</label>
            <select
              className="input-box"
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

          <div className="input-field">
            <label className="input-label">Nome</label>
            <input
              type="text"
              className="input-box"
              value={formData.nome}
              onChange={handleChange("nome")}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Descrição</label>
            <textarea
              className="input-box"
              rows={3}
              value={formData.descricao}
              onChange={handleChange("descricao")}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Preço</label>
            <input
              type="number"
              className="input-box"
              value={formData.preco}
              onChange={handleChange("preco")}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Estoque</label>
            <input
              type="number"
              className="input-box"
              value={formData.estoque}
              onChange={handleChange("estoque")}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={handleConfirm}>
            {modo === "editar" ? "Salvar" : "Cadastrar"}
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProdutoModal;
