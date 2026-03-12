import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";

import NuevoProveedor from "../../components/Popups/NuevoProveedor/NuevoProveedor";

const PROVEEDORES = [
  {
    name: "Sistemas Corporativos S.A.",
    email: "contacto@sistemascorp.com",
    phone: "+52 55 1234 5678",
    taxId: "RFC: SCO010203AB1",
    notes: "Proveedor de soluciones ERP y soporte técnico empresarial.",
  },
  {
    name: "Tech Solutions México",
    email: "ventas@techsolutions.mx",
    phone: "+52 55 8765 4321",
    taxId: "TSM040506CD2",
    notes: "Especialistas en infraestructura tecnológica y redes.",
  },
  {
    name: "Oficina Global",
    email: "info@oficinaglobal.com",
    phone: "+52 55 2468 1357",
    taxId: "OGL070809EF3",
    notes: "Distribuidor de material de oficina y mobiliario corporativo.",
  },
  {
    name: "Servicios Integrales Pro",
    email: "servicios@integralespro.mx",
    phone: "+52 55 9876 5432",
    taxId: "SIP100112GH4",
    notes: "Servicios de mantenimiento y soporte administrativo.",
  },
  {
    name: "Distribuidora Nacional",
    email: "admin@distribuidoranacional.com",
    phone: "+52 55 3691 2580",
    taxId: "DNA130415IJ5",
    notes: "Proveedor mayorista de suministros industriales.",
  },
  {
    name: "Consultoría Empresarial",
    email: "contacto@consultoriaempresarial.mx",
    phone: "+52 55 7531 9514",
    taxId: "CEM160718KL6",
    notes: "Consultoría en estrategia empresarial y gestión financiera.",
  },
  {
    name: "Suministros Industriales",
    email: "ventas@suministrosindustriales.com",
    phone: "+52 55 1592 7538",
    taxId: "SIN190921MN7",
    notes: "Venta de herramientas y equipo industrial.",
  },
  {
    name: "Tecnología Avanzada",
    email: "info@tecavanzada.mx",
    phone: "+52 55 9517 5362",
    taxId: "TAV220324OP8",
    notes: "Proveedor de hardware, software y soluciones en la nube.",
  },
];

const COLUMN_HEADERS = [
  "Nombre",
  "Email",
  "Teléfono",
  "Identificación fiscal",
  "Notas",
];

const TOTAL_COLUMNS = COLUMN_HEADERS.length + 1; // +1 for "Acciones"

// Sub-components

function ProveedorRow({ proveedor }) {
  return (
    <tr>
      <td>{proveedor.name}</td>
      <td>{proveedor.email}</td>
      <td>{proveedor.phone}</td>
      <td>{proveedor.taxId}</td>
      <td>{proveedor.notes}</td>
      <td className="actionCell">
        <RiEditLine className="tableActionIcon" />
        <MdDeleteOutline className="tableActionIcon" />
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

// Main component

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
          isOpen={addProveedorShow}
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
              {COLUMN_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th className="actionCell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.length > 0 ? (
              filteredProveedores.map((p) => (
                <ProveedorRow key={p.email} proveedor={p} />
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
