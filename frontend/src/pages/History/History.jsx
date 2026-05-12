import { useState, useEffect, useContext } from "react";
import { IoSearchOutline } from "react-icons/io5";

import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import AddInvoice from "../../components/Popups/AddInvoice/AddInvoice.jsx";
import OrderDetails from "../../components/Popups/OrderDetails/OrderDetails.jsx";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import { getOrders } from "../../services/orderService";
import { AuthContext } from "../../context/AuthContext";

function History() {
  // Get current user and determine role
  const { user } = useContext(AuthContext);
  const isAdmin = user.roleName === "admin";

  // Search and department filter state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Orders data and loading state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [addInvoiceShow, setAddInvoiceShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);

  // Current year (used to filter historical data)
  const currentYear = new Date().getFullYear();

  // Fetch orders and keep only historical ones (not current year)
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders();

      const historico = data.filter((order) => {
        const year = new Date(order.orderDate).getFullYear();
        return year !== currentYear;
      });

      setOrders(historico);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Normalize search input
  const searchLower = search.toLowerCase();

  // Apply search + department filter
  const filteredOrdenes = orders.filter((order) => {
    const matchesSearch =
      !searchLower ||
      order.notes?.toLowerCase().includes(searchLower) ||
      order.generatedOrderCode?.toLowerCase().includes(searchLower) ||
      order.investmentPlanCode?.toLowerCase().includes(searchLower);

    const matchesDepartment = !filter || order.departmentId === Number(filter);

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="page">
      <h1>Histórico de Órdenes de Compra</h1>

      {/* Invoice popup (read-only mode) */}
      {addInvoiceShow && selectedOrden && (
        <AddInvoice
          hidePopup={() => setAddInvoiceShow(false)}
          isOpen={addInvoiceShow}
          data={selectedOrden.invoices}
          hide
        />
      )}

      {/* Order details popup */}
      {showDetails && selectedOrden && (
        <OrderDetails
          hidePopup={() => setShowDetails(false)}
          isOpen={showDetails}
          data={selectedOrden}
        />
      )}

      {/* Top controls: search + optional department filter */}
      <div className="flex flex-col lg:flex-row gap-4 md:items-center">
        {/* Search input */}
        <div className="order-2 md:order-1 md:max-w-full lg:max-w-100 searchBar">
          <IoSearchOutline className="search-icon iconProveedores" />
          <input
            type="text"
            placeholder="Buscar por código o descripción"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Department filter (only visible for admin) */}
        {isAdmin && (
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto md:ml-auto order-1 md:order-2">
            <DepartmentFilter
              id="ordenFilter"
              value={filter}
              onChange={setFilter}
            />
          </div>
        )}
      </div>

      {/* Content: loading, empty state, or table */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredOrdenes.length === 0 ? (
        <div className="mt-6 rounded-lg bg-secondary/60 p-6 text-center text-sm text-primary">
          No se encontraron órdenes históricas
        </div>
      ) : (
        <OrdersTable
          ordenes={filteredOrdenes}
          onInvoices={(order) => {
            setSelectedOrden(order);
            setAddInvoiceShow(true);
          }}
          onViewDetails={(order) => {
            setSelectedOrden(order);
            setShowDetails(true);
          }}
        />
      )}
    </div>
  );
}

export default History;
