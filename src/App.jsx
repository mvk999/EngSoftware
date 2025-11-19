import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Categorias from './routes/Tela_Admin/Categorias';
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/categorias" element={<Categorias />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
