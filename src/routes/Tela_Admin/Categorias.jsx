import './Categorias.css'
//import React, { useState} from "react";
import NavBarAdmin from './NavBarAdmin'
import Table from './Table';
function Categorias() {

  return (
    <div className='Container'>
        <NavBarAdmin></NavBarAdmin>
        <div className='ContentCategorias'>
            <div className='TopContentCategorias'>
                <img src="/src/assets/Avatar.svg" alt='Avatar' />
                <button className="Button"></button>
                <img src="/src/assets/ShopCart.svg" alt="Shop Cart" />
            </div>
            <Table></Table>
        </div>
    </div>
  )
}

export default Categorias