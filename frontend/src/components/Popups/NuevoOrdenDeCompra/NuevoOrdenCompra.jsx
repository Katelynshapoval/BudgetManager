import Modal from "../../Modal/Modal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSuppliers } from "../../../services/supplierService";

function NuevoOrdenDeCompra({ hidePopup, isOpen }) {
  const [proveedores, setProveedores] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  const loadSuppliers = async (departmentId) => {
    try {
      const data = await getSuppliers(departmentId);
      setProveedores(data);
    } catch (err) {
      toast.error("Error cargando proveedores");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [selectedDept]);

  return (
    <Modal title="Crear un Órden de Compra" onClose={hidePopup} isOpen={isOpen}>
      <div className="popupInputContainer">
        <label htmlFor="proveedor">Proveedor</label>
        <select id="proveedor" className="input">
          <option value="">Seleccionar proveedor</option>

          {proveedores.map((p) => (
            <option key={p.supplierId} value={p.supplierId}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="popupInputContainer">
        <label htmlFor="cantidadOrden">Cantidad</label>
        <input id="cantidadOrden" type="number" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="descripcionOrden">Descripción</label>
        <input id="descripcionOrden" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="fechaOrden">Fecha de Orden</label>
        <input id="fechaOrden" type="date" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="fungibleOrden">Fungible</label>
        <input id="fungibleOrden" type="checkbox" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="tipoPresupuesto">Origen de Fondos</label>
        <input id="tipoPresupuesto" type="checkbox" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="tipoPresupuesto">Facturas (opcional)</label>
        <input id="tipoPresupuesto" type="checkbox" className="input" />
      </div>
    </Modal>
  );
}

export default NuevoOrdenDeCompra;
