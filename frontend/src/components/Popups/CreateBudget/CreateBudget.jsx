import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../../Modal/Modal";
import {
  createBudget,
  fetchAvailableDepartments,
} from "../../../services/budgetService";

function CreateBudget({ hidePopup, isOpen, type, year, onCreated }) {
  // Set the fiscal year options based on the provided year or the current year
  const currentYear = new Date().getFullYear();
  const fiscalStartYear = year ?? currentYear;
  const yearOptions = [
    fiscalStartYear,
    fiscalStartYear + 1,
    fiscalStartYear + 2,
  ];

  // Store the form values entered by the user
  const [allocated, setAllocated] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [fiscalYear, setFiscalYear] = useState(fiscalStartYear);

  // Store the available departments and loading state
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Display the correct label depending on the budget type
  const typeLabel =
    type === "plan de inversiones" ? "Plan de Inversión" : "Budget";

  // Clear the form fields when the popup is opened again
  const resetForm = () => {
    setAllocated("");
    setDepartmentId("");
    setFiscalYear(fiscalStartYear);
  };

  // Load departments available for the selected fiscal year and budget type
  const loadDepartments = async (targetYear) => {
    setLoadingDepartments(true);

    try {
      const data = await fetchAvailableDepartments(targetYear, type);
      setDepartments(data || []);
      setDepartmentId("");
    } catch (error) {
      console.error("Error fetching available departments:", error);
      toast.error("Error cargando departamentos disponibles.");
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Reset the form and load departments when the popup opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
      loadDepartments(fiscalStartYear);
    }
  }, [isOpen, fiscalStartYear, type]);

  // Reload departments when the selected fiscal year changes
  useEffect(() => {
    if (isOpen) {
      loadDepartments(fiscalYear);
    }
  }, [fiscalYear, isOpen, type]);

  // Validate the form and create the budget
  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedAllocated = Number(allocated);
    const parsedYear = Number(fiscalYear);

    if (Number.isNaN(parsedAllocated) || parsedAllocated < 0) {
      toast.error("Introduce un importe válido.");
      return;
    }

    if (!departmentId) {
      toast.error("Selecciona un departamento.");
      return;
    }

    if (Number.isNaN(parsedYear) || parsedYear < 2000) {
      toast.error("Introduce un año fiscal válido.");
      return;
    }

    try {
      await createBudget({
        allocated: parsedAllocated,
        departmentId: Number(departmentId),
        year: parsedYear,
        type,
      });

      toast.success(`${typeLabel} creado correctamente.`);
      hidePopup();
      onCreated?.();
    } catch (error) {
      console.error("Error creating budget:", error);

      const errorMessage =
        error?.response?.data?.error ||
        `No se pudo crear ${typeLabel.toLowerCase()}.`;

      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      title={`Crear ${typeLabel}`}
      onClose={hidePopup}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      submitLabel="Crear"
    >
      {/* Input for the allocated amount */}
      <div className="popupInputContainer">
        <label htmlFor="allocatedAmount">Dinero asignado</label>
        <input
          id="allocatedAmount"
          type="number"
          min="0"
          step="0.01"
          className="input"
          value={allocated}
          onChange={(event) => setAllocated(event.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      {/* Select for choosing the department */}
      <div className="popupInputContainer">
        <label htmlFor="departmentSelect">Departamento</label>
        <select
          id="departmentSelect"
          className="select"
          value={departmentId}
          onChange={(event) => setDepartmentId(event.target.value)}
          disabled={loadingDepartments || departments.length === 0}
          required
        >
          <option value="">
            {loadingDepartments
              ? "Cargando departamentos..."
              : "Selecciona un departamento"}
          </option>

          {departments.map((department) => (
            <option
              key={department.departmentId}
              value={department.departmentId}
            >
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select for choosing the fiscal year */}
      <div className="popupInputContainer">
        <label htmlFor="fiscalYear">Año fiscal</label>
        <select
          id="fiscalYear"
          className="select"
          value={fiscalYear}
          onChange={(event) => setFiscalYear(Number(event.target.value))}
          required
        >
          {yearOptions.map((optionYear) => (
            <option key={optionYear} value={optionYear}>
              {optionYear}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}

export default CreateBudget;
