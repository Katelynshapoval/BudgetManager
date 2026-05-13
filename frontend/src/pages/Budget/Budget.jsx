import "./Budget.css";
import { useEffect, useState, useContext } from "react";
import { toast } from "sonner";

import { IoCreateOutline } from "react-icons/io5";

import Accordion from "../../components/Accordion/Accordion";
import CreateBudget from "../../components/Popups/CreateBudget/CreateBudget.jsx";
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
      toast.error("Introduce un importe válido.");
      return;
    }

    try {
      await onUpdateAllocated(budgetId, parsedValue);
      toast.success("Budget actualizado correctamente");
      cancelEditing();
    } catch (error) {
      console.error("Error updating allocated amount:", error);
      toast.error("No se pudo actualizar el presupuesto.");
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
function BudgetSection({
  id,
  title,
  data,
  user,
  onUpdateAllocated,
  canCreate,
  createLabel,
  onCreateClick,
}) {
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          {(isAdmin || isContable) && (
            <DepartmentFilter id={id} value={filter} onChange={setFilter} />
          )}

          {canCreate && (
            <button
              className="addNewButton md:ml-auto"
              type="button"
              onClick={onCreateClick}
            >
              {createLabel}
            </button>
          )}
        </div>

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
function Budget() {
  const { user } = useContext(AuthContext);

  const [budgetData, setBudgetData] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [showInvestmentPopup, setShowInvestmentPopup] = useState(false);

  const year = new Date().getFullYear();
  const canCreate =
    user.roleName === "admin" || user.roleName === "jefe_departamento";

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

  const loadData = async () => {
    try {
      const budgets = await fetchBudgets(year, "presupuesto");
      const investments = await fetchBudgets(year, "plan de inversiones");

      setBudgetData(budgets);
      setInvestmentData(investments);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [year]);

  return (
    <div className="page">
      <h1 className="text-2xl md:text-3xl">Panel de Presupuestos</h1>

      {showBudgetPopup && (
        <CreateBudget
          isOpen={showBudgetPopup}
          hidePopup={() => setShowBudgetPopup(false)}
          type="presupuesto"
          year={year}
          onCreated={loadData}
        />
      )}

      {showInvestmentPopup && (
        <CreateBudget
          isOpen={showInvestmentPopup}
          hidePopup={() => setShowInvestmentPopup(false)}
          type="plan de inversiones"
          year={year}
          onCreated={loadData}
        />
      )}

      <div className="flex flex-col gap-12">
        {/* Budget section */}
        <BudgetSection
          id="filter-presupuestos"
          title="Presupuestos"
          data={budgetData}
          user={user}
          onUpdateAllocated={updateAllocated}
          canCreate={canCreate}
          createLabel="Crear Presupuesto"
          onCreateClick={() => setShowBudgetPopup(true)}
        />

        {/* Investment section */}
        <BudgetSection
          id="filter-inversion"
          title="Plan de Inversión"
          data={investmentData}
          user={user}
          onUpdateAllocated={updateAllocated}
          canCreate={canCreate}
          createLabel="Crear Plan de Inversión"
          onCreateClick={() => setShowInvestmentPopup(true)}
        />
      </div>
    </div>
  );
}

export default Budget;
