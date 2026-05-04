import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IoDocumentTextOutline,
  IoPeopleOutline,
  IoCartOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoMenuOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

import { useClickOutside } from "../../hooks/useClickOutside";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Presupuestos",
    icon: IoDocumentTextOutline,
    end: true,
  },
  {
    to: "/proveedores",
    label: "Proveedores",
    icon: IoCubeOutline,
  },
  {
    to: "/ordenes",
    label: "Órdenes de compra",
    icon: IoCartOutline,
  },
  {
    to: "/historico",
    label: "Histórico",
    icon: IoTimeOutline,
  },
  {
    to: "/usuarios",
    label: "Usuarios",
    icon: IoPeopleOutline,
    roles: ["admin"],
  },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const labelClass = isOpen ? "" : "label-hidden";

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.roleName);
  });

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close the sidebar when clicking outside of it.
  useClickOutside(sidebarRef, isOpen, closeSidebar);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-998 flex items-center gap-3 bg-text text-background px-4 py-3 md:hidden">
        <IoMenuOutline
          className="min-w-10 text-3xl rounded-lg cursor-pointer hover:bg-accent"
          onClick={() => setIsOpen(true)}
        />
        <span className="text-lg font-normal">BudgetManager</span>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-[999]
          flex flex-col justify-between gap-4
          h-screen p-4
          bg-text text-background
          overflow-hidden
          transition-all duration-300 ease-in-out
          md:relative md:translate-x-0
          ${
            isOpen
              ? "w-2xs translate-x-0"
              : "w-20 -translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-4 text-xl mx-1 my-7">
          <IoMenuOutline
            className="min-w-10 p-1.5 text-4xl rounded-lg cursor-pointer hover:bg-accent"
            onClick={toggleSidebar}
          />

          <span
            className={`whitespace-nowrap transition-opacity duration-150 ease-in-out ${labelClass}`}
          >
            BudgetManager
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-lg">
            {visibleNavItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `navItem ${isActive ? "active" : ""}`
                  }
                  onClick={closeSidebar}
                >
                  <Icon className="optionIcon" />
                  <span className={labelClass}>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div>
          <hr className="border-background/20 mb-3" />

          <button className="navItem" type="button" onClick={handleLogout}>
            <IoLogOutOutline className="optionIcon" />
            <span className={labelClass}>Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
