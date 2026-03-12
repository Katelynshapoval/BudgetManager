import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import { RiEditLine } from "react-icons/ri";
import { EUR } from "../../utils/currency";
import NuevoOrdenDeCompra from "../../components/NuevoOrdenDeCompra/NuevoOrdenCompra";
import { RiInfoI } from "react-icons/ri";
import AgregarFacturaPopup from "../../components/AgregarFactura/AgregarFacturaPopup";

const ORDENES = [
  {
    purchase_order_id: 1,
    description:
      "Adquisición de licencias anuales para herramientas de gestión y colaboración.",
    order_amount: 125000.0,
    notes: "Aprobado por dirección de TI.",
    generated_order_code: "OC-2026-001",
    investment_plan_code: "INV2026",
    is_fungible: 0,
    order_sequence: 1,
    locked_at: null,
    order_date: "2026-02-15",
    supplier_id: 2,
    budget_id: 5,
    created_by: 1,
    created_at: "2026-02-15 10:30:00",
    updated_at: "2026-02-15 10:30:00",
    facturas: [],
  },
  {
    purchase_order_id: 2,
    description:
      "Contratación de consultoría externa para modernización de infraestructura digital.",
    order_amount: 89500.0,
    notes: "Proyecto estratégico de transformación digital.",
    generated_order_code: "OC-2026-002",
    investment_plan_code: "INV2026",
    is_fungible: 0,
    order_sequence: 2,
    locked_at: null,
    order_date: "2026-02-20",
    supplier_id: 4,
    budget_id: 3,
    created_by: 1,
    created_at: "2026-02-20 09:15:00",
    updated_at: "2026-02-20 09:15:00",
    facturas: [{ file: "lol", amount: 1000 }],
  },
  {
    purchase_order_id: 3,
    description:
      "Compra de mobiliario y equipo para nuevas estaciones de trabajo.",
    order_amount: 45000.0,
    notes: "Incluye escritorios ergonómicos y sillas.",
    generated_order_code: "OC-2026-003",
    investment_plan_code: "INV2026",
    is_fungible: 1,
    order_sequence: 3,
    locked_at: null,
    order_date: "2026-02-28",
    supplier_id: 3,
    budget_id: 2,
    created_by: 1,
    created_at: "2026-02-28 14:45:00",
    updated_at: "2026-02-28 14:45:00",
    facturas: [
      { file: "lol", amount: 1000 },
      { file: "ll", amount: 222 },
    ],
  },
];

function Historico() {
  const [search, setSearch] = useState("");
  const [addOrdenShow, setAddOrdenShow] = useState(false);
  const [addInvoiceShow, setAddInvoiceShow] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [filter, setFilter] = useState("");

  return (
    <div className="page">
      <h1>Histórico de Órdenes de Compra</h1>
      {addInvoiceShow && (
        <AgregarFacturaPopup
          hidePopup={() => setAddInvoiceShow(false)}
          popupStatus={addInvoiceShow}
          data={selectedOrden.facturas}
          hide={true}
        />
      )}
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
        </div>
      </div>
      <div className="hideHorizontalScroll">
        <table className="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Importe</th>
              <th>Facturas</th>
              <th>Fecha </th>
              <th className="actionCell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ORDENES.filter((row) => !filter || row.department === filter).map(
              (row) => (
                <tr key={row.id}>
                  <td>tipo</td>
                  <td>{row.generated_order_code}</td>
                  <td>{row.description}</td>
                  <td>{EUR.format(row.order_amount)}</td>
                  <td>
                    <button
                      className={
                        row.facturas.length === 0 ? "addInvoice" : "viewInvoice"
                      }
                      onClick={() => {
                        setSelectedOrden(row);
                        setAddInvoiceShow(true);
                      }}
                    >
                      {`${row.facturas.length} facturas`}
                    </button>
                  </td>
                  <td>{row.order_date}</td>
                  <td className="actionCell">
                    <RiInfoI className="tableActionIcon" />
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

export default Historico;
