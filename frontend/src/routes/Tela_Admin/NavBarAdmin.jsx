import React, { useEffect, useState } from "react";
import "./NavBarAdmin.css";
import Logo from "../../assets/Logo.svg";
import IconNav from "../../assets/IconNav.svg";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserType } from "../../utils/auth";

function NavBarAdmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const tipo = getUserType();
      setIsAdmin(tipo === "ADMIN");
    }
  }, []);

  return (
    <div className="ContainerNavBar">
      <div className="BarraSuperior">
        <button className="Logo">
          <img src={Logo} alt="Logo" />
        </button>
      </div>
      <div className="BarraLateralLinks">
        <button className="BotaoNavBar" onClick={() => navigate("/")}>
          <img className="IconNav" src={IconNav} alt="Icon" />
          Início
        </button>
        {isAdmin && (
          <>
            <button
              className="BotaoNavBar"
              onClick={() => navigate("/pedidos")}
            >
              <img className="IconNav" src={IconNav} alt="Icon" />
              Pedidos
            </button>
            <button
              className="BotaoNavBar"
              onClick={() => navigate("/produtos")}
            >
              <img className="IconNav" src={IconNav} alt="Icon" />
              Produtos
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBarAdmin;
