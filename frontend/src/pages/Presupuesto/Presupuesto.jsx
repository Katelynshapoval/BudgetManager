import "./Presupuesto.css";
import Accordion from "../../components/Accordion/Accordion";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import { useEffect, useState, useContext } from "react";
import { RiEditLine } from "react-icons/ri";
import { EUR } from "../../utils/currency";
import { AuthContext } from "../../context/AuthContext";

function BudgetTable({ data, user, onUpdateAllocated }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-primary text-base font-normal">
        No hay presupuestos disponibles para este filtro.
      </div>
    );
  }

  const canEdit = user.roleName != "contable";

  const startEditing = (row) => {
    setEditingId(row.budgetId);
    setEditValue(row.allocated);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

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

  const handleKeyDown = async (e, budgetId) => {
    if (e.key === "Enter") {
      await saveEditing(budgetId);
    }

    if (e.key === "Escape") {
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
            const currentAllocated = isEditing
              ? Number(editValue || 0)
              : row.allocated;

            return (
              <tr key={row.budgetId}>
                <td>{row.department}</td>

                <td className="relative">
                  <div className="relative">
                    <div
                      className={`tabular-nums ${isEditing ? "opacity-0" : ""}`}
                    >
                      {EUR.format(row.allocated)}
                    </div>

                    {isEditing && (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, row.budgetId)}
                        onBlur={() => saveEditing(row.budgetId)}
                        autoFocus
                        className="absolute inset-0 w-full inlineEditInput reset-input"
                      />
                    )}
                  </div>
                </td>

                <td>{EUR.format(row.spent)}</td>
                <td>{EUR.format(row.remaining)}</td>

                {canEdit && (
                  <td className="actionCell">
                    <RiEditLine
                      className="tableActionIcon"
                      onClick={() => startEditing(row)}
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

function BudgetSection({ id, title, data, user, onUpdateAllocated }) {
  const isAdmin = user.roleName == "admin";
  const [filter, setFilter] = useState(!isAdmin ? user.departmentId : "");

  const filteredData = filter
    ? data.filter((row) => row.departmentId === Number(filter))
    : data;

  return (
    <Accordion title={title} defaultOpen={!isAdmin}>
      <div className="p-6">
        {isAdmin && (
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

function Presupuesto() {
  const [budgetData, setBudgetData] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);
  const { user } = useContext(AuthContext);

  const year = new Date().getFullYear(); // current year

  const updateAllocated = async (budgetId, allocated) => {
    const res = await fetch(`http://localhost:8080/api/budgets/${budgetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ allocated }),
    });

    if (!res.ok) {
      throw new Error("Failed to update budget");
    }

    const updatedBudget = await res.json();

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

  useEffect(() => {
    // Fetch yearly budget
    fetch(`http://localhost:8080/api/budgets?year=${year}&type=presupuesto`)
      .then((res) => res.json())
      .then((data) => {
        setBudgetData(data);
      });

    // Fetch investment plan data
    fetch(
      `http://localhost:8080/api/budgets?year=${year}&type=plan de inversiones`,
    )
      .then((res) => res.json())
      .then((data) => {
        setInvestmentData(data);
      });
  }, [year]);

  return (
    <div className="page">
      <div>
        <h1 className="text-2xl md:text-3xl">Panel de Presupuestos</h1>

        <div className="flex flex-col gap-12">
          <BudgetSection
            id="filter-presupuestos"
            title="Presupuestos"
            data={budgetData}
            user={user}
            onUpdateAllocated={updateAllocated}
          />

          <BudgetSection
            id="filter-inversion"
            title="Plan de Inversión"
            data={investmentData}
            user={user}
            onUpdateAllocated={updateAllocated}
          />
        </div>
      </div>
    </div>
  );
}

export default Presupuesto;
