import "./Presupuesto.css";
import Accordion from "../../components/Accordion/Accordion";
import { useState } from "react";
import { RiEditLine } from "react-icons/ri";

const DEPARTMENTS = [
  "Recursos Humanos",
  "Tecnología",
  "Operaciones",
  "Marketing",
];

const EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const BUDGET_DATA = [
  { department: "Recursos Humanos", assigned: 2500000, spent: 1875000 },
  { department: "Tecnología", assigned: 2300000, spent: 2200000 },
  { department: "Operaciones", assigned: 2100000, spent: 2100000 },
  { department: "Marketing", assigned: 1950000, spent: 1950000 },
];

const INVESTMENT_DATA = [
  { department: "Tecnología", assigned: 300000, spent: 200000 },
  { department: "Operaciones", assigned: 2100000, spent: 2100000 },
  { department: "Marketing", assigned: 1950000, spent: 1950000 },
];

function DepartmentFilter({ id, value, onChange }) {
  return (
    <div className="filter">
      <label htmlFor={id} className="text-primary">
        Filtrar por departamento:
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
}

function BudgetTable({ data }) {
  return (
    <div className="hideHorizontalScroll">
      <table className="table">
        <thead>
          <tr>
            <th>Departamento</th>
            <th>Asignado</th>
            <th>Gastado</th>
            <th>Disponible</th>
            <th className="actionCell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.department}>
              <td>{row.department}</td>
              <td>{EUR.format(row.assigned)}</td>
              <td>{EUR.format(row.spent)}</td>
              <td>{EUR.format(row.assigned - row.spent)}</td>
              <td className="actionCell">
                <RiEditLine className="tableActionIcon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BudgetSection({ id, title, data }) {
  const [filter, setFilter] = useState("");

  const filteredData = filter
    ? data.filter((row) => row.department === filter)
    : data;

  return (
    <Accordion title={title}>
      <div className="p-6">
        <DepartmentFilter id={id} value={filter} onChange={setFilter} />
        <BudgetTable data={filteredData} />
      </div>
    </Accordion>
  );
}

function Presupuesto() {
  return (
    <div className="page">
      <div>
        <h1 className="text-2xl md:text-3xl">Panel de Presupuestos</h1>
        <div className="flex flex-col gap-12">
          <BudgetSection
            id="filter-presupuestos"
            title="Presupuestos"
            data={BUDGET_DATA}
          />
          <BudgetSection
            id="filter-inversion"
            title="Plan de Inversión"
            data={INVESTMENT_DATA}
          />
        </div>
      </div>
    </div>
  );
}

export default Presupuesto;
