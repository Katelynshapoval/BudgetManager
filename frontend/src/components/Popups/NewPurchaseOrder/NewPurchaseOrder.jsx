import { useEffect, useState } from "react";
import { toast } from "sonner";

import Modal from "../../Modal/Modal";
import { getSuppliers } from "../../../services/supplierService";
import { getBudgetTypes } from "../../../services/budgetTypesService";
import {
  getOrderPreview,
  createPurchaseOrder,
} from "../../../services/orderService";
import { fetchDepartments } from "../../../services/metaService";

function NuevoOrdenDeCompra({ hidePopup, isOpen, user, onCreated }) {
  const isAdmin = user?.roleName === "admin";

  // Select options
  const [proveedores, setProveedores] = useState([]);
  const [tiposPresupuesto, setTiposPresupuesto] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  // Form values
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [importe, setImporte] = useState("");
  const [fechaOrden, setFechaOrden] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Budget type specific values
  const [investmentCode, setInvestmentCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isFungible, setIsFungible] = useState(false);

  const selectedBudgetType = tiposPresupuesto.find(
    (tipo) => tipo.name === selectedTipo,
  );

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  // Clear the form after creating an order
  const resetForm = () => {
    setSelectedProveedor("");
    setSelectedTipo("");
    setImporte("");
    setFechaOrden("");
    setDescripcion("");
    setInvestmentCode("");
    setGeneratedCode("");
    setIsFungible(false);

    if (isAdmin) {
      setSelectedDept("");
    }
  };

  // Load fixed form data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [budgetTypes, departments] = await Promise.all([
          getBudgetTypes(),
          fetchDepartments(),
        ]);

        setTiposPresupuesto(budgetTypes);
        setDepartamentos(departments);
      } catch {
        toast.error("Error cargando datos del formulario");
      }
    };

    loadInitialData();
  }, []);

  // Regular users can only create orders for their department
  useEffect(() => {
    if (!isAdmin && user?.departmentId) {
      setSelectedDept(String(user.departmentId));
    }
  }, [isAdmin, user]);

  // Load suppliers for the selected department
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await getSuppliers({
          departmentId: selectedDept || undefined,
        });

        setProveedores(data);
      } catch {
        toast.error("Error cargando proveedores");
      }
    };

    loadSuppliers();
  }, [selectedDept]);

  // Preview the generated code for budget orders
  useEffect(() => {
    if (selectedTipo !== "presupuesto") {
      setGeneratedCode("");
      return;
    }

    const loadPreviewCode = async () => {
      if (!selectedDept || !selectedBudgetType?.budgetTypeId) return;

      try {
        const data = await getOrderPreview(
          selectedDept,
          selectedBudgetType.budgetTypeId,
          isFungible,
        );

        setGeneratedCode(data.code);
      } catch {
        setGeneratedCode("");
      }
    };

    loadPreviewCode();
  }, [
    selectedTipo,
    selectedDept,
    selectedBudgetType?.budgetTypeId,
    isFungible,
  ]);

  // Keep only validations that depend on app logic
  const validateForm = () => {
    if (!selectedBudgetType?.budgetTypeId) {
      toast.error("Selecciona un origen de fondos");
      return false;
    }

    if (selectedTipo === "plan de inversiones" && !investmentCode.trim()) {
      toast.error("Ingresa el código de inversión");
      return false;
    }

    return true;
  };

  // Changing department also changes the supplier list
  const handleDepartmentChange = (departmentId) => {
    setSelectedDept(departmentId);
    setSelectedProveedor("");
  };

  // Clear fields that do not belong to the new budget type
  const handleBudgetTypeChange = (budgetTypeName) => {
    setSelectedTipo(budgetTypeName);
    setInvestmentCode("");
    setGeneratedCode("");
  };

  // Build the payload expected by the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      supplierId: Number(selectedProveedor),
      departmentId: Number(selectedDept),
      budgetTypeId: Number(selectedBudgetType.budgetTypeId),
      quantity: Number(importe),
      orderDate: fechaOrden,
      description: descripcion.trim(),
      isFungible,
      investmentCode:
        selectedTipo === "plan de inversiones"
          ? investmentCode.trim().toUpperCase()
          : null,
    };

    try {
      await createPurchaseOrder(payload);

      toast.success("Orden de compra creada correctamente");
      resetForm();

      if (onCreated) {
        await onCreated();
      }

      hidePopup();
    } catch (error) {
      toast.error(error.message || "Error creando la orden de compra");
    }
  };

  return (
    <Modal
      title="Crear una Orden de Compra"
      onClose={hidePopup}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      submitLabel="Crear orden"
    >
      <div className="flex flex-col gap-4">
        {/* Supplier and department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="popupInputContainer">
            <label htmlFor="departamento">Departamento</label>
            <select
                id="departamento"
                value={selectedDept}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                disabled={!isAdmin}
                required
                className={`input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg ${
                    !isAdmin ? "opacity-70" : ""
                }`}
            >
              <option value="">Seleccionar departamento</option>

              {departamentos.map((departamento) => (
                  <option
                      key={departamento.departmentId}
                      value={departamento.departmentId}
                  >
                    {departamento.name}
                  </option>
              ))}
            </select>
          </div>

          <div className="popupInputContainer">
            <label htmlFor="proveedor">Proveedor</label>
            <select
                id="proveedor"
                value={selectedProveedor}
                onChange={(e) => setSelectedProveedor(e.target.value)}
                required
                className="input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg"
            >
              <option value="">Seleccionar proveedor</option>

              {proveedores.map((proveedor) => (
                  <option key={proveedor.supplierId} value={proveedor.supplierId}>
                    {proveedor.name}
                  </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget type */}
        <div className="popupInputContainer">
          <label htmlFor="tipoPresupuesto">Origen de Fondos</label>
          <select
            id="tipoPresupuesto"
            value={selectedTipo}
            onChange={(e) => handleBudgetTypeChange(e.target.value)}
            required
            className="input appearance-none bg-secondary pr-10 cursor-pointer p-3 border border-primary rounded-lg"
          >
            <option value="">Seleccionar tipo</option>

            {tiposPresupuesto.map((tipo) => (
              <option key={tipo.budgetTypeId} value={tipo.name}>
                {capitalize(tipo.name)}
              </option>
            ))}
          </select>
        </div>

        {/* Investment orders need a manual code */}
        {selectedTipo === "plan de inversiones" && (
          <div className="popupInputContainer">
            <label htmlFor="investmentCode">Código de inversión</label>
            <input
              id="investmentCode"
              type="text"
              maxLength={7}
              value={investmentCode}
              onChange={(e) => setInvestmentCode(e.target.value.toUpperCase())}
              required
              className="input uppercase tracking-widest"
              placeholder="Ej: 1234567"
            />
          </div>
        )}

        {/* Budget orders show the backend preview code */}
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

        {/* Amount and order date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="popupInputContainer">
            <label htmlFor="importe">Importe</label>
            <input
              id="importe"
              type="number"
              min="1"
              max="9999999999"
              step="0.01"
              value={importe}
              onChange={(e) => setImporte(e.target.value)}
              required
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
              required
              className="input"
            />
          </div>
        </div>

        {/* Order description */}
        <div className="popupInputContainer">
          <label htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="input"
          />
        </div>

        {/* Fungible flag sent to the backend */}
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
