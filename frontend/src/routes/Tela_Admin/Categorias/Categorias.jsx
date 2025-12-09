import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarAdmin from '../NavBarAdmin';
import CategoriaTable from './CategoriaTable';
import CategoriaModal from './CategoriaModal';
import '../../Tela_Admin/Produto/Produto.css';

const API_BASE_URL = 'http://localhost:3000';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState('editar');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const getConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Extrai mensagem de erro enviada pelo backend em formatos comuns
  const extractErrorMessage = (err) => {
    if (!err) return 'Erro desconhecido';
    // Axios response com body
    if (err.response && err.response.data) {
      const d = err.response.data;
      if (typeof d === 'string') return d;
      // Prioriza campos usados pelo backend do projeto (openapi -> { erro, detalhes })
      return d.erro || d.error || d.message || d.detalhes || JSON.stringify(d);
    }
    // Fallback para mensagem genérica
    return err.message || String(err);
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_BASE_URL}/categoria`);
      // Normaliza possíveis formatos retornados pelo backend
      const lista = (resp.data || []).map((c) => ({
        id: c.id ?? c.id_categoria ?? c.idCategoria ?? null,
        nome: c.nome ?? c.name ?? "",
      }));
      setCategorias(lista);
    } catch (err) {
      console.error('Erro ao carregar categorias', err);
      alert(extractErrorMessage(err) || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCadastrar = () => {
    setCategoriaSelecionada(null);
    setModo('cadastrar');
    setShowModal(true);
  };

  const abrirModalEditar = (cat) => {
    setCategoriaSelecionada(cat);
    setModo('editar');
    setShowModal(true);
  };

  const handleConfirm = async (form) => {
    const config = getConfig();
    if (!config) {
      alert('Token inválido ou ausente. Faça login novamente.');
      return;
    }

    try {
      if (modo === 'editar') {
        const id = form.id;
        const resp = await axios.put(`${API_BASE_URL}/categoria/${id}`, { nome: form.nome }, config);
        // Backend pode retornar { id_categoria, nome }
        const atualizado = resp.data;
        const catNorm = {
          id: atualizado?.id ?? atualizado?.id_categoria ?? atualizado?.idCategoria ?? id,
          nome: atualizado?.nome ?? form.nome,
        };

        setCategorias((prev) => prev.map((c) => (c.id === catNorm.id ? { ...c, ...catNorm } : c)));
        alert('Categoria atualizada com sucesso.');
      } else {
        const resp = await axios.post(`${API_BASE_URL}/categoria`, { nome: form.nome }, config);
        const nova = resp.data;
        const novaNorm = {
          id: nova?.id ?? nova?.id_categoria ?? nova?.idCategoria ?? null,
          nome: nova?.nome ?? form.nome,
        };
        if (novaNorm.id) setCategorias((prev) => [...prev, novaNorm]);
        else await carregarCategorias();
        alert('Categoria cadastrada com sucesso.');
      }

      setShowModal(false);
    } catch (err) {
      console.error('Erro ao salvar categoria', err);
      const msg = extractErrorMessage(err) || 'Erro ao salvar categoria.';
      alert(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return alert('ID inválido');
    if (!window.confirm('Deseja excluir esta categoria?')) return;
    const config = getConfig();
    if (!config) return alert('Token inválido ou ausente. Faça login novamente.');
    try {
      await axios.delete(`${API_BASE_URL}/categoria/${id}`, config);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      alert('Categoria excluída com sucesso.');
    } catch (err) {
      console.error('Erro ao excluir categoria', err);
      const msg = extractErrorMessage(err) || 'Erro ao excluir categoria.';
      alert(msg);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: 20 }}>Carregando...</div>;

  return (
    <div className="prod-container">
      <CategoriaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        categoria={categoriaSelecionada}
        modo={modo}
      />

      <NavBarAdmin />

      <div className="prod-content-categorias">
        <div className="prod-top-content-categorias">
          <img src="/src/assets/Avatar.svg" alt="Avatar" />
          <button className="prod-button-admin">Admin</button>
          <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
        </div>

        <CategoriaTable
          categorias={categorias}
          onEditar={abrirModalEditar}
          onDelete={handleDelete}
        />

        <button
          className="prod-button-admin"
          onClick={abrirModalCadastrar}
          style={{ marginTop: 20 }}
        >
          Cadastrar Categoria
        </button>
      </div>
    </div>
  );
}

export default Categorias;
