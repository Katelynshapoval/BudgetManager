import { useState, useEffect, useRef } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";

import "./Sidebar.css";

function Sidebar() {
  const [showMenu, setShowMenu] = useState(false);
  const sidebarRef = useRef(null);

  // Close the menu if clicked outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div
      ref={sidebarRef}
      className={`sideBar ${showMenu ? "expanded" : "collapsed"}`}
    >
      <div className="top">
        <IoMdMenu
          id="menuIcon"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />
        <span className="logoText">BudgetManager</span>
      </div>
      <ul className="sections">
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
          >
            <IoDocumentTextOutline className="optionIcon" />
            <span className="label">Presupuestos</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/proveedores"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
          >
            <GoPeople className="optionIcon" />
            <span className="label">Proveedores</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/ordenes"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
          >
            <FiShoppingCart className="optionIcon" />
            <span className="label">Órdenes de compra</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/historico"
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
          >
            <MdHistory className="optionIcon" />
            <span className="label">Histórico</span>
          </NavLink>
        </li>
      </ul>
      <div className="logoutSidebar">
        <hr />
        <div className="navItem">
          <MdLogout className="optionIcon" />
          <span className="logoutText">Salir</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
