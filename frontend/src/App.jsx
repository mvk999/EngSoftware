import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Produtos from './routes/Tela_Admin/Produto/Produtos';
import Pedidos from './routes/Tela_Admin/Pedidos/Pedidos';
import Login from './routes/Tela_Login/Login'
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/produtos" element={<Produtos />} />
        <Route path="/admin/pedidos" element={<Pedidos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
