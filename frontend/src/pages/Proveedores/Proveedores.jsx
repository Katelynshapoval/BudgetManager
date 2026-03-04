import "./Proveedores.css";
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";

function Proveedor() {
  return (
    <div className="page">
      <h1>Panel de Proveedores</h1>
      <div className="buttonsProveedores">
        <div className="searchByName">
          <CiSearch className="search-icon" />
          <input type="text" placeholder="Buscar por nombre" />
        </div>
        <button>
          <IoAddOutline />
          Nuevo proveedor
        </button>
      </div>
    </div>
  );
}

export default Proveedor;
