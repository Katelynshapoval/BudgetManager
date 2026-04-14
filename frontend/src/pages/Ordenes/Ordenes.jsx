import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import NuevoOrdenDeCompra from "../../components/Popups/NuevoOrdenDeCompra/NuevoOrdenCompra";
import AgregarFactura from "../../components/Popups/AgregarFactura/AgregarFactura";
import DetallesOrden from "../../components/Popups/DetallesOrden/DetallesOrden";
import OrdenesTable from "../../components/OrdenesTable/OrdenesTable";

function Ordenes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [orders, setOrders] = useState([]);

  const [addOrdenShow, setAddOrdenShow] = useState(false);
  const [addInvoiceShow, setAddInvoiceShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedOrden, setSelectedOrden] = useState(null);

  // const filteredOrdenes = orders.filter((row) => {
  //   const matchesSearch =
  //     row.notes.toLowerCase().includes(search.toLowerCase()) ||
  //     row.generatedOrderCode.toLowerCase().includes(search.toLowerCase());

  //   const matchesDepartment = !filter || row.department === filter;

  //   return matchesSearch && matchesDepartment;
  // });

  const filteredOrdenes = orders;

  useEffect(() => {
    fetch("http://localhost:8080/api/purchase-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error("Error fetching purchase orders:", err));
  }, []);

  return (
    <div className="page">
      <h1>Panel de Órdenes de Compra</h1>

      {addOrdenShow && (
        <NuevoOrdenDeCompra
          hidePopup={() => setAddOrdenShow(false)}
          isOpen={addOrdenShow}
        />
      )}

      {addInvoiceShow && selectedOrden && (
        <AgregarFactura
          hidePopup={() => setAddInvoiceShow(false)}
          isOpen={addInvoiceShow}
          data={selectedOrden.invoices}
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

          <button
            className="addNewButton"
            onClick={() => setAddOrdenShow(true)}
          >
            Crear orden de compra
          </button>
        </div>
      </div>

      <OrdenesTable
        ordenes={filteredOrdenes}
        showEdit={true}
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

export default Ordenes;
