import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Produtos from './routes/Tela_Admin/Produto/Produtos';
import Categorias from './routes/Tela_Admin/Categorias/Categorias';
import Pedidos from './routes/Tela_Admin/Pedidos/Pedidos';
import Login from './routes/Tela_Login/Login'
import Register from './routes/Tela_Register/Register'
import EsqueceuSenha from './routes/Tela_Esqueceu/EsqueceuSenha'
import Dashboard from './routes/Dashboard/Dashboard'
import { Navigate } from "react-router-dom";
import { isAdmin } from "./utils/auth";
import Carrinho from './routes/Carrinho/Cart'
import { isAuthenticated } from "./utils/auth";
function RotaAdmin({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/login" />;
  }
  return children;
}


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
            path="/produtos"
            element={
              <RotaAdmin>
                <Produtos />
              </RotaAdmin>
            }
        />

        <Route
            path="/categorias"
            element={
              <RotaAdmin>
                <Categorias />
              </RotaAdmin>
            }
        />

        <Route
            path="/pedidos"
            element={
              <RotaAdmin>
                <Pedidos />
              </RotaAdmin>
            }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/esqueceu" element={<EsqueceuSenha />} />
        <Route path="/" element={<Dashboard />} />
         <Route
           path="/carrinho"
           element={
             isAuthenticated() ? (
               <Carrinho />
             ) : (
               <Navigate to="/login" />
             )
           }
         />
      </Routes>
    </BrowserRouter>
  )
}

export default App
