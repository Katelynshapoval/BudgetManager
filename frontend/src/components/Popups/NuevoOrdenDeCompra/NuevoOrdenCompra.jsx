import Modal from "../../Modal/Modal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSuppliers } from "../../../services/supplierService";
import { getBudgetTypes } from "../../../services/budgetTypesService";

function NuevoOrdenDeCompra({ hidePopup, isOpen }) {
  const [proveedores, setProveedores] = useState([]);
  const [tiposPresupuesto, setTiposPresupuesto] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers({ departmentId: selectedDept });
      setProveedores(data);
    } catch {
      toast.error("Error cargando proveedores");
    }
  };

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

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <Modal title="Crear un Órden de Compra" onClose={hidePopup} isOpen={isOpen}>
      <div className="flex flex-col gap-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proveedor */}
          <div className="popupInputContainer">
            <label htmlFor="proveedor">Proveedor</label>
            <select
              id="proveedor"
              className="input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg"
            >
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
            <label htmlFor="tipoPresupuesto">Origen de Fondos</label>
            <select
              id="tipoPresupuesto"
              className="input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg"
            >
              <option value="">Seleccionar tipo</option>
              {tiposPresupuesto.map((t) => (
                <option key={t.budgetTypeId} value={t.budgetTypeId}>
                  {capitalize(t.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="popupInputContainer">
            <label htmlFor="cantidad">Cantidad</label>
            <input id="cantidad" type="number" className="input" />
          </div>

          <div className="popupInputContainer">
            <label htmlFor="fechaOrden">Fecha de Orden</label>
            <input id="fechaOrden" type="date" className="input" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="popupInputContainer">
          <label htmlFor="descripcion">Descripción</label>
          <input id="descripcion" type="text" className="input" />
        </div>

        {/* Row 4 */}
        <div className="flex items-center gap-2 text-sm text-primary">
          <input id="fungible" type="checkbox" className="w-4 h-4" />
          <label htmlFor="fungible">Fungible</label>
        </div>
      </div>
    </Modal>
  );
}

export default NuevoOrdenDeCompra;
