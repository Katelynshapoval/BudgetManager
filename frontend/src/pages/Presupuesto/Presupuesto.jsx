import "./Presupuesto.css";
import { useEffect, useState, useContext } from "react";

import { IoCreateOutline } from "react-icons/io5";

import Accordion from "../../components/Accordion/Accordion";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import EditableCell from "../../components/EditableCell/EditableCell";

import { EUR } from "../../utils/currency";
import { AuthContext } from "../../context/AuthContext";
import { updateBudget, fetchBudgets } from "../../services/budgetService";

// TABLE COMPONENT
function BudgetTable({ data, user, onUpdateAllocated }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const canEdit = user.roleName !== "contable";

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-primary text-base font-normal">
        No hay presupuestos disponibles.
      </div>
    );
  }

  // Start editing a row
  const startEditing = (row) => {
    setEditingId(row.budgetId);
    setEditValue(row.allocated);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Save edited value
  const saveEditing = async (budgetId) => {
    const parsedValue = Number(editValue);

    if (Number.isNaN(parsedValue) || parsedValue < 0) {
      alert("Introduce un importe válido.");
      return;
    }

    try {
      await onUpdateAllocated(budgetId, parsedValue);
      cancelEditing();
    } catch (error) {
      console.error("Error updating allocated amount:", error);
      alert("No se pudo actualizar el presupuesto.");
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = async (event, budgetId) => {
    if (event.key === "Enter") {
      await saveEditing(budgetId);
    }

    if (event.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <div className="hideHorizontalScroll">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Departamento</th>
            <th>Asignado</th>
            <th>Gastado</th>
            <th>Disponible</th>
            {canEdit && <th className="actionCell">Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            const isEditing = editingId === row.budgetId;

            return (
              <tr key={row.budgetId}>
                <td>{row.department}</td>

                <EditableCell
                  value={EUR.format(row.allocated)}
                  isEditing={isEditing}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onKeyDown={(event) => handleKeyDown(event, row.budgetId)}
                  onSave={() => saveEditing(row.budgetId)}
                  onCancel={cancelEditing}
                />

                <td>{EUR.format(row.spent)}</td>
                <td>{EUR.format(row.remaining)}</td>

                {canEdit && (
                  <td className="actionCell">
                    <IoCreateOutline
                      className="tableActionIcon"
                      onClick={() => startEditing(row)}
                      title="Editar"
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// SECTION COMPONENT
function BudgetSection({ id, title, data, user, onUpdateAllocated }) {
  const isAdmin = user.roleName === "admin";
  const isContable = user.roleName === "contable";

  // Default filter: non-admin users only see their department
  const [filter, setFilter] = useState(!isAdmin ? user.departmentId : "");

  // Apply department filter
  const filteredData = filter
    ? data.filter((row) => row.departmentId === Number(filter))
    : data;

  return (
    <Accordion title={title} defaultOpen={!isAdmin && !isContable}>
      <div className="p-6">
        {/* Department filter for admin and contable */}
        {(isAdmin || isContable) && (
          <DepartmentFilter id={id} value={filter} onChange={setFilter} />
        )}

        <BudgetTable
          data={filteredData}
          user={user}
          onUpdateAllocated={onUpdateAllocated}
        />
      </div>
    </Accordion>
  );
}

// MAIN PAGE
function Presupuesto() {
  const { user } = useContext(AuthContext);

  const [budgetData, setBudgetData] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);

  const year = new Date().getFullYear();

  // Update allocated value in both datasets
  const updateAllocated = async (budgetId, allocated) => {
    const updatedBudget = await updateBudget(budgetId, allocated);

    setBudgetData((prev) =>
      prev.map((item) =>
        item.budgetId === budgetId ? { ...item, ...updatedBudget } : item,
      ),
    );

    setInvestmentData((prev) =>
      prev.map((item) =>
        item.budgetId === budgetId ? { ...item, ...updatedBudget } : item,
      ),
    );
  };

  // Load budgets on mount
  useEffect(() => {
    async function loadData() {
      try {
        const budgets = await fetchBudgets(year, "presupuesto");
        const investments = await fetchBudgets(year, "plan de inversiones");

        setBudgetData(budgets);
        setInvestmentData(investments);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    }

    loadData();
  }, [year]);

  return (
    <div className="page">
      <h1 className="text-2xl md:text-3xl">Panel de Presupuestos</h1>

      <div className="flex flex-col gap-12">
        {/* Budget section */}
        <BudgetSection
          id="filter-presupuestos"
          title="Presupuestos"
          data={budgetData}
          user={user}
          onUpdateAllocated={updateAllocated}
        />

        {/* Investment section */}
        <BudgetSection
          id="filter-inversion"
          title="Plan de Inversión"
          data={investmentData}
          user={user}
          onUpdateAllocated={updateAllocated}
        />
      </div>
    </div>
  );
}

export default Presupuesto;
