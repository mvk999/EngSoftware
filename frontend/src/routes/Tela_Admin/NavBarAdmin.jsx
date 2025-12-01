import './NavBarAdmin.css'
import Logo from '../../assets/Logo.svg'
import IconNav from '../../assets/IconNav.svg'
import { useNavigate } from "react-router-dom";

function NavBarAdmin() {
  const navigate = useNavigate();
  return (
    <div className='ContainerNavBar'>
        <div className='BarraSuperior'>
            <button className='Logo'>
                <img src={Logo} alt='Logo'/>
            </button>
        </div>
        <div className='BarraLateralLinks'>
            <button className='BotaoNavBar'><img className='IconNav' src={IconNav} alt='Icon'></img>Início</button>
            <button className='BotaoNavBar'onClick={()=> navigate("/pedidos")}><img className='IconNav' src={IconNav} alt='Icon'></img>Pedidos</button>
            <button className='BotaoNavBar'onClick={()=> navigate("/produtos")}><img className='IconNav' src={IconNav} alt='Icon'></img>Produtos</button>
        </div>
    </div>
  )
}

export default NavBarAdmin