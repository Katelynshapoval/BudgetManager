import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { RiEditLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import NuevoProveedor from "../../components/NuevoProveedor/NuevoProveedor";
import { useState } from "react";

const PROVEEDORES = [
  {
    name: "Sistemas Corporativos S.A.",
    email: "contacto@sistemascorp.com",
    phone: "+52 55 1234 5678",
  },
  {
    name: "Tech Solutions México",
    email: "ventas@techsolutions.mx",
    phone: "+52 55 8765 4321",
  },
  {
    name: "Oficina Global",
    email: "info@oficinaglobal.com",
    phone: "+52 55 2468 1357",
  },
  {
    name: "Servicios Integrales Pro",
    email: "servicios@integralespro.mx",
    phone: "+52 55 9876 5432",
  },
  {
    name: "Distribuidora Nacional",
    email: "admin@distribuidoranacional.com",
    phone: "+52 55 3691 2580",
  },
  {
    name: "Consultoría Empresarial",
    email: "contacto@consultoriaempresarial.mx",
    phone: "+52 55 7531 9514",
  },
  {
    name: "Suministros Industriales",
    email: "ventas@suministrosindustriales.com",
    phone: "+52 55 1592 7538",
  },
  {
    name: "Tecnología Avanzada",
    email: "info@tecavanzada.mx",
    phone: "+52 55 9517 5362",
  },
];

function Proveedor() {
  const [addProveedorShow, setAddProveedorShow] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProveedores = PROVEEDORES.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page proveedores">
      <h1>Panel de Proveedores</h1>

      {addProveedorShow && (
        <NuevoProveedor
          hidePopup={() => setAddProveedorShow(false)}
          popupStatus={addProveedorShow}
        />
      )}

      {/* Toolbar */}
      <div className="controlButtons">
        <div className="searchBar">
          <CiSearch className="search-icon iconProveedores" />
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="addNewButton"
          onClick={() => setAddProveedorShow(true)}
        >
          <IoAddOutline className="iconProveedores" />
          Nuevo proveedor
        </button>
      </div>

      {/* Table */}
      <div className="hideHorizontalScroll">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th className="actionCell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.map((p) => (
              <tr key={p.email}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td className="actionCell">
                  <RiEditLine className="tableActionIcon" />
                  <MdDeleteOutline className="tableActionIcon" />
                </td>
              </tr>
            ))}
            {filteredProveedores.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-primary">
                  No se encontraron proveedores
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Proveedor;
