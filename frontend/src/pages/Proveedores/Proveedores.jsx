import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";

import NuevoProveedor from "../../components/Popups/NuevoProveedor/NuevoProveedor";
import { getSuppliers } from "../../services/supplierService";

const COLUMN_HEADERS = [
  "Nombre",
  "Email",
  "Teléfono",
  "Identificación fiscal",
  "Notas",
];

const TOTAL_COLUMNS = COLUMN_HEADERS.length + 1;

// Delete Supplier
const deleteSupplier = async (id, setProveedores) => {
  if (!window.confirm("¿Estás seguro de borrar este proveedor?")) return;

  try {
    const response = await fetch(`/api/suppliers?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      setProveedores((prev) => prev.filter((p) => p.supplierId !== id));
    } else {
      alert("Error al eliminar el proveedor");
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión al servidor");
  }
};

function ProveedorRow({ proveedor, setProveedores }) {
  return (
    <tr>
      <td>{proveedor.name}</td>
      <td>{proveedor.email}</td>
      <td>{proveedor.phone}</td>
      <td>{proveedor.taxId}</td>
      <td>{proveedor.notes}</td>
      <td className="actionCell">
        <RiEditLine className="tableActionIcon" />
        <MdDeleteOutline
          className="tableActionIcon"
          onClick={() => deleteSupplier(proveedor.supplierId, setProveedores)}
        />
      </td>
    </tr>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td colSpan={TOTAL_COLUMNS} className="text-center text-primary">
        No se encontraron proveedores
      </td>
    </tr>
  );
}

function Proveedor() {
  const [addProveedorShow, setAddProveedorShow] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredProveedores = proveedores.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);

      const data = await getSuppliers({ all: true });

      setProveedores(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page proveedores">
      <h1>Panel de Proveedores</h1>

      {addProveedorShow && (
        <NuevoProveedor
          hidePopup={() => setAddProveedorShow(false)}
          isOpen={addProveedorShow}
        />
      )}

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

      <div className="hideHorizontalScroll">
        <table className="table">
          <thead>
            <tr>
              {COLUMN_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th className="actionCell">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={TOTAL_COLUMNS}>Cargando...</td>
              </tr>
            ) : filteredProveedores.length > 0 ? (
              filteredProveedores.map((p) => (
                <ProveedorRow
                  key={p.supplierId}
                  proveedor={p}
                  setProveedores={setProveedores}
                />
              ))
            ) : (
              <EmptyRow />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Proveedor;
