import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DepartmentFilter from "../../components/DepartmentFilter";
import { RiEditLine } from "react-icons/ri";
import { EUR } from "../../utils/currency";

const ORDENES = [
  {
    id: "OC-2026-001",
    department: "Marketing",
    cantidad: 125000.0,
    observaciones: "Compra de licencias de software empresarial",
    fecha: "15/02/2026",
    facturas: null,
  },
  {
    id: "OC-2026-002",
    department: "Recursos Humanos",
    cantidad: 89500.0,
    observaciones: "Servicios de consultoría tecnológica",
    fecha: "20/02/2026",
    facturas: null,
  },
  {
    id: "OC-2026-003",
    department: "Ingeneria",
    cantidad: 45000.0,
    observaciones: "Equipamiento de oficina",
    fecha: "28/02/2026",
    facturas: null,
  },
];

function Ordenes() {
  const [search, setSearch] = useState("");
  const [addOrdenShow, setAddOrdenShow] = useState(false);
  const [filter, setFilter] = useState("");

  return (
    <div className="page">
      <h1>Panel de Órdenes de Compra</h1>
      <div className="flex flex-col lg:flex-row gap-4 md:items-center">
        <div className="order-2 md:order-1 md:max-w-full lg:max-w-100 searchBar">
          <CiSearch className="search-icon iconProveedores" />
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto md:ml-auto order-1 md:order-2">
          <DepartmentFilter
            id="ordenFilter"
            value={filter}
            onChange={setFilter}
          />
          <button className="addNewButton">Crear orden de compra</button>
        </div>
      </div>
      <div className="hideHorizontalScroll">
        <table className="table">
          <thead>
            <tr>
              <th>Departamento</th>
              <th>Asignado</th>
              <th>Gastado</th>
              <th>Disponible</th>
              <th className="actionCell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ORDENES.filter((row) => !filter || row.department === filter).map(
              (row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{EUR.format(row.cantidad)}</td>
                  <td>{row.observaciones}</td>
                  <td>{row.facturas}</td>
                  <td className="actionCell">
                    <RiEditLine className="tableActionIcon" />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ordenes;
