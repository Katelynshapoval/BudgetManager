import "./Proveedores.css";
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";

function Proveedor() {
  return (
    <div className="page">
      <h1>Panel de Proveedores</h1>
      <div className="buttonsProveedores">
        <div className="searchByName">
          <CiSearch className="search-icon iconProveedores" />
          <input type="text" placeholder="Buscar por nombre" />
        </div>
        <button className="nuevoProveedor">
          <IoAddOutline className="iconProveedores" />
          Nuevo proveedor
        </button>
      </div>
    </div>
  );
}

export default Proveedor;
