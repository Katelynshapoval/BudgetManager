import Modal from "../../Modal/Modal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSuppliers } from "../../../services/supplierService";
import { getBudgetTypes } from "../../../services/budgetTypesService";

function NuevoOrdenDeCompra({ hidePopup, isOpen }) {
  const [proveedores, setProveedores] = useState([]);
  const [tiposPresupuesto, setTiposPresupuesto] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  // Load suppliers
  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers({ departmentId: selectedDept });
      setProveedores(data);
    } catch {
      toast.error("Error cargando proveedores");
    }
  };

  // Load budget types
  const loadBudgetTypes = async () => {
    try {
      const data = await getBudgetTypes();
      setTiposPresupuesto(data);
    } catch {
      toast.error("Error cargando tipos de presupuesto");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [selectedDept]);

  useEffect(() => {
    loadBudgetTypes();
  }, []);

  return (
    <Modal title="Crear un Órden de Compra" onClose={hidePopup} isOpen={isOpen}>
      {/* Proveedor */}
      <div className="popupInputContainer">
        <label>Proveedor</label>
        <select className="input">
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((p) => (
            <option key={p.supplierId} value={p.supplierId}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo presupuesto */}
      <div className="popupInputContainer">
        <label>Origen de Fondos</label>
        <select className="input">
          <option value="">Seleccionar tipo</option>
          {tiposPresupuesto.map((t) => (
            <option key={t.budgetTypeId} value={t.budgetTypeId}>
              {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Rest of fields */}
      <div className="popupInputContainer">
        <label>Cantidad</label>
        <input type="number" className="input" />
      </div>

      <div className="popupInputContainer">
        <label>Descripción</label>
        <input type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label>Fecha de Orden</label>
        <input type="date" className="input" />
      </div>

      <div className="popupInputContainer">
        <label>Fungible</label>
        <input type="checkbox" />
      </div>
    </Modal>
  );
}

export default NuevoOrdenDeCompra;
