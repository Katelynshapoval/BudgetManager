import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import { MdHistory, MdLogout } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import "./Sidebar.css";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Presupuestos",
    icon: IoDocumentTextOutline,
    end: true,
  },
  { to: "/proveedores", label: "Proveedores", icon: GoPeople },
  {
    to: "/ordenes",
    label: "Órdenes de compra",
    icon: FiShoppingCart,
  },
  { to: "/historico", label: "Histórico", icon: MdHistory },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const closeSidebar = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeSidebar]);

  const labelClass = isOpen ? "" : "label-hidden";

  return (
    <>
      {/* Mobile-only top bar */}
      <div className="fixed top-0 left-0 right-0 z-998 flex items-center gap-3 bg-text text-background px-4 py-3 md:hidden">
        <IoMdMenu
          className="min-w-10 text-3xl rounded-lg cursor-pointer hover:bg-accent"
          onClick={() => setIsOpen(true)}
        />
        <span className="text-lg font-normal ">BudgetManager</span>
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
    flex flex-col justify-between gap-4
    p-4 h-screen
    bg-text text-background
    overflow-hidden transition-all duration-300 ease-in-out
    z-[999]
    fixed top-0 left-0
    md:relative md:translate-x-0
    ${isOpen ? "w-2xs translate-x-0" : "w-20 -translate-x-full md:translate-x-0"}
  `}
      >
        {/* Header */}
        <div className="flex items-center gap-4 text-xl mx-1 my-7">
          <IoMdMenu
            className="min-w-10 p-1.5 text-4xl rounded-lg cursor-pointer hover:bg-accent"
            onClick={() => setIsOpen((prev) => !prev)}
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
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
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
          <button className="navItem" type="button">
            <MdLogout
              className="optionIcon"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            />
            <span className={labelClass}>Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
