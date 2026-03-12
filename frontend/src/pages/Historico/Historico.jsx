import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import AgregarFactura from "../../components/Popups/AgregarFactura/AgregarFactura";
import DetallesOrden from "../../components/Popups/DetallesOrden/DetallesOrden";
import OrdenesTable from "../../components/OrdenesTable/OrdenesTable";

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
  const [filter, setFilter] = useState("");

  const [addInvoiceShow, setAddInvoiceShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedOrden, setSelectedOrden] = useState(null);

  const filteredOrdenes = ORDENES.filter((row) => {
    const matchesSearch =
      row.description.toLowerCase().includes(search.toLowerCase()) ||
      row.generated_order_code.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment = !filter || row.department === filter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="page">
      <h1>Histórico de Órdenes de Compra</h1>

      {addInvoiceShow && selectedOrden && (
        <AgregarFactura
          hidePopup={() => setAddInvoiceShow(false)}
          isOpen={addInvoiceShow}
          data={selectedOrden.facturas}
          hide={true}
        />
      )}

      {showDetails && selectedOrden && (
        <DetallesOrden
          hidePopup={() => setShowDetails(false)}
          isOpen={showDetails}
          data={selectedOrden}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 md:items-center">
        <div className="order-2 md:order-1 md:max-w-full lg:max-w-100 searchBar">
          <CiSearch className="search-icon iconProveedores" />
          <input
            type="text"
            placeholder="Buscar por nombre o código"
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

      <OrdenesTable
        ordenes={filteredOrdenes}
        onInvoices={(row) => {
          setSelectedOrden(row);
          setAddInvoiceShow(true);
        }}
        onViewDetails={(row) => {
          setSelectedOrden(row);
          setShowDetails(true);
        }}
      />
    </div>
  );
}

export default Historico;
