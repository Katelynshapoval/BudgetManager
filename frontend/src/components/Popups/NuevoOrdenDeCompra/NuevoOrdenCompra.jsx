import Modal from "../../Modal/Modal";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSuppliers } from "../../../services/supplierService";
import { getBudgetTypes } from "../../../services/budgetTypesService";
import { getOrderPreview } from "../../../services/orderService";
import { fetchDepartments } from "../../../services/metaService";

function NuevoOrdenDeCompra({ hidePopup, isOpen, user }) {
  const [proveedores, setProveedores] = useState([]);
  const [tiposPresupuesto, setTiposPresupuesto] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fechaOrden, setFechaOrden] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const isAdmin = user.roleName == "admin";

  const [investmentCode, setInvestmentCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const [isFungible, setIsFungible] = useState(false);

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

  // Load departments
  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartamentos(data);
    } catch {
      toast.error("Error cargando departamentos");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [selectedDept]);

  useEffect(() => {
    loadBudgetTypes();
    loadDepartments();
  }, []);

  useEffect(() => {
    if (!isAdmin && user?.departmentId) {
      setSelectedDept(user.departmentId);
    }
  }, [isAdmin, user]);

  // Fetch preview code when "presupuesto"
  useEffect(() => {
    if (selectedTipo === "presupuesto") {
      const fetchPreview = async () => {
        try {
          const budgetId = 1;

          const data = await getOrderPreview(budgetId, isFungible);
          setGeneratedCode(data.code);
        } catch {
          setGeneratedCode("");
        }
      };

      fetchPreview();
    }
  }, [selectedTipo, isFungible]);

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
              value={selectedProveedor}
              onChange={(e) => setSelectedProveedor(Number(e.target.value))}
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
          <div className="popupInputContainer">
            <label htmlFor="departamento">Departamento</label>
            <select
              id="departamento"
              value={selectedDept || ""}
              onChange={(e) => setSelectedDept(Number(e.target.value))}
              disabled={!isAdmin}
              className={`input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg ${!isAdmin ? "opacity-70" : ""}`}
            >
              <option value="">Seleccionar departamento</option>
              {departamentos.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Tipo presupuesto */}
          <div className="popupInputContainer">
            <label htmlFor="tipoPresupuesto">Origen de Fondos</label>
            <select
              id="tipoPresupuesto"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg"
            >
              <option value="">Seleccionar tipo</option>
              {tiposPresupuesto.map((t) => (
                <option key={t.budgetTypeId} value={t.name}>
                  {capitalize(t.name)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Conditional fields */}
        {selectedTipo === "plan de inversiones" && (
          <div className="popupInputContainer">
            <label htmlFor="investmentCode">Código de inversión</label>
            <input
              id="investmentCode"
              type="text"
              maxLength={7}
              value={investmentCode}
              onChange={(e) => setInvestmentCode(e.target.value.toUpperCase())}
              className="input uppercase tracking-widest"
              placeholder="Ej: 1234567"
            />
          </div>
        )}

        {selectedTipo === "presupuesto" && (
          <div className="popupInputContainer">
            <label htmlFor="generatedCode">Código generado</label>
            <input
              id="generatedCode"
              type="text"
              value={generatedCode || "Se generará automáticamente"}
              disabled
              className="input opacity-70 cursor-not-allowed"
            />
          </div>
        )}

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="popupInputContainer">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="input"
            />
          </div>

          <div className="popupInputContainer">
            <label htmlFor="fechaOrden">Fecha de Orden</label>
            <input
              id="fechaOrden"
              type="date"
              value={fechaOrden}
              onChange={(e) => setFechaOrden(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="popupInputContainer">
          <label htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input"
          />
        </div>

        {/* Row 5 */}
        <div className="flex items-center gap-2 text-sm text-primary">
          <input
            id="fungible"
            type="checkbox"
            checked={isFungible}
            onChange={(e) => setIsFungible(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="fungible">Fungible</label>
        </div>
      </div>
    </Modal>
  );
}

export default NuevoOrdenDeCompra;
