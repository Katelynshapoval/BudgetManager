import { useState, useEffect, useContext } from "react";
import { CiSearch } from "react-icons/ci";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import NuevoOrdenDeCompra from "../../components/Popups/NuevoOrdenDeCompra/NuevoOrdenCompra";
import AgregarFactura from "../../components/Popups/AgregarFactura/AgregarFactura";
import DetallesOrden from "../../components/Popups/DetallesOrden/DetallesOrden";
import OrdenesTable from "../../components/OrdenesTable/OrdenesTable";
import { getOrders } from "../../services/orderService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../context/AuthContext";

function Ordenes() {
  // User
  const { user } = useContext(AuthContext);
  const isAdmin = user.roleName === "admin";

  // Search + filter state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Orders data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup states
  const [addOrdenShow, setAddOrdenShow] = useState(false);
  const [addInvoiceShow, setAddInvoiceShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Currently selected order
  const [selectedOrden, setSelectedOrden] = useState(null);

  // Normalize search
  const searchLower = search.toLowerCase();

  // Filter logic
  const filteredOrdenes = orders.filter((row) => {
    const matchesSearch =
      !searchLower ||
      row.notes?.toLowerCase().includes(searchLower) ||
      row.generatedOrderCode?.toLowerCase().includes(searchLower) ||
      row.investmentPlanCode?.toLowerCase().includes(searchLower);

    const matchesDepartment = !filter || row.departmentId == Number(filter);

    return matchesSearch && matchesDepartment;
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders();

      const currentYear = new Date().getFullYear();

      const currentOrders = data.filter((o) => {
        const year = new Date(o.orderDate).getFullYear();
        return year === currentYear;
      });

      setOrders(currentOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page">
      <h1>Panel de Órdenes de Compra</h1>

      {/* Create order popup */}
      {addOrdenShow && (
        <NuevoOrdenDeCompra
          hidePopup={() => setAddOrdenShow(false)}
          isOpen={addOrdenShow}
        />
      )}

      {/* Add invoice popup */}
      {addInvoiceShow && selectedOrden && (
        <AgregarFactura
          hidePopup={() => setAddInvoiceShow(false)}
          isOpen={addInvoiceShow}
          data={selectedOrden.invoices}
          purchaseOrderId={selectedOrden.purchaseOrderId}
          hide={false}
          onUploadSuccess={fetchOrders}
        />
      )}

      {/* Order details popup */}
      {showDetails && selectedOrden && (
        <DetallesOrden
          hidePopup={() => setShowDetails(false)}
          isOpen={showDetails}
          data={selectedOrden}
        />
      )}

      {/* Top controls: search + filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:items-center">
        <div className="order-2 md:order-1 md:max-w-full lg:max-w-100 searchBar">
          <CiSearch className="search-icon iconProveedores" />
          <input
            type="text"
            placeholder="Buscar por código o descripción"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto md:ml-auto order-1 md:order-2">
          {isAdmin && (
            <DepartmentFilter
              id="ordenFilter"
              value={filter}
              onChange={setFilter}
            />
          )}

          <button
            className="addNewButton"
            onClick={() => setAddOrdenShow(true)}
          >
            Crear orden de compra
          </button>
        </div>
      </div>

      {/* Table or empty state */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredOrdenes.length === 0 ? (
        <div className="mt-6 rounded-lg bg-secondary/60 p-6 text-center text-sm text-primary">
          No se encontraron órdenes de compra
        </div>
      ) : (
        <OrdenesTable
          ordenes={filteredOrdenes}
          showEdit
          onInvoices={(row) => {
            setSelectedOrden(row);
            setAddInvoiceShow(true);
          }}
          onViewDetails={(row) => {
            setSelectedOrden(row);
            setShowDetails(true);
          }}
        />
      )}
    </div>
  );
}

export default Ordenes;
