import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Login from './routes/Tela_Login/login'
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
