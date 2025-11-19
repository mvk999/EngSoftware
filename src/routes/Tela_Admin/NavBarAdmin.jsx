import './NavBarAdmin.css'
import Logo from '../../assets/Logo.svg'
import IconNav from '../../assets/IconNav.svg'

function NavBarAdmin() {
  return (
    <div className='ContainerNavBar'>
        <div className='BarraSuperior'>
            <button className='Logo'>
                <img src={Logo} alt='Logo'/>
            </button>
        </div>
        <div className='BarraLateralLinks'>
            <button className='BotaoNavBar'><img className='IconNav' src={IconNav} alt='Icon'></img>Início</button>
            <button className='BotaoNavBar'><img className='IconNav' src={IconNav} alt='Icon'></img>Pedidos</button>
            <button className='BotaoNavBar'><img className='IconNav' src={IconNav} alt='Icon'></img>Categorias</button>
        </div>
    </div>
  )
}

export default NavBarAdmin