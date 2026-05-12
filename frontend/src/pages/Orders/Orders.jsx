import { useState, useEffect, useContext } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "sonner";

import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import NuevoOrdenDeCompra from "../../components/Popups/NewPurchaseOrder/NewPurchaseOrder.jsx";
import AddInvoice from "../../components/Popups/AddInvoice/AddInvoice.jsx";
import OrderDetails from "../../components/Popups/OrderDetails/OrderDetails.jsx";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import { getOrders, deletePurchaseOrder } from "../../services/orderService";
import { AuthContext } from "../../context/AuthContext";

function Orders() {
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
  const [addOrdenShow, setAddOrdenShow] = useState(false);
  const [addInvoiceShow, setAddInvoiceShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Currently selected order
  const [selectedOrden, setSelectedOrden] = useState(null);

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

  // Fetch current year orders
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders();
      const currentYear = new Date().getFullYear();

      const currentOrders = data.filter((order) => {
        const year = new Date(order.orderDate).getFullYear();
        return year === currentYear;
      });

      setOrders(currentOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (order) => {
    try {
      await deletePurchaseOrder(order.purchaseOrderId);
      toast.success("Orden eliminada correctamente");
      await fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Error al eliminar la orden de compra");
    }
  };

  return (
    <div className="page">
      <h1>Panel de Órdenes de Compra</h1>

      {/* Create order popup */}
      {addOrdenShow && (
        <NuevoOrdenDeCompra
          hidePopup={() => setAddOrdenShow(false)}
          isOpen={addOrdenShow}
          user={user}
          onCreated={fetchOrders}
        />
      )}

      {/* Add invoice popup */}
      {addInvoiceShow && selectedOrden && (
        <AddInvoice
          hidePopup={() => setAddInvoiceShow(false)}
          isOpen={addInvoiceShow}
          data={selectedOrden.invoices}
          purchaseOrderId={selectedOrden.purchaseOrderId}
          onUploadSuccess={fetchOrders}
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

      {/* Top controls: search + filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:items-center">
        {/* Search input */}
        <div className="order-2 md:order-1 md:max-w-full lg:max-w-100 searchBar">
          <IoSearchOutline className="search-icon iconProveedores" />
          <input
            type="text"
            placeholder="Buscar por código o descripción"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto md:ml-auto order-1 md:order-2">
          {/* Department filter (admin only) */}
          {isAdmin && (
            <DepartmentFilter
              id="ordenFilter"
              value={filter}
              onChange={setFilter}
            />
          )}

          {/* Create order button */}
          <button
            className="addNewButton"
            onClick={() => setAddOrdenShow(true)}
          >
            Crear orden de compra
          </button>
        </div>
      </div>

      {/* Content: loading, empty state, or table */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredOrdenes.length === 0 ? (
        <div className="mt-6 rounded-lg bg-secondary/60 p-6 text-center text-sm text-primary">
          No se encontraron órdenes de compra
        </div>
      ) : (
        <OrdersTable
          ordenes={filteredOrdenes}
          showDelete={isAdmin}
          onDelete={handleDeleteOrder}
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

export default Orders;
