import "./Presupuesto.css";
import Accordion from "../../components/Accordion/Accordion";
import DepartmentFilter from "../../components/DepartmentFilter/DepartmentFilter";
import { useEffect, useState } from "react";
import { RiEditLine } from "react-icons/ri";
import { EUR } from "../../utils/currency";

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
              <td>{EUR.format(row.allocated)}</td>
              <td>{EUR.format(row.spent)}</td>
              <td>{EUR.format(row.allocated - row.spent)}</td>
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
  const [budgetData, setBudgetData] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);

  const year = new Date().getFullYear(); // current year

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
          />

          <BudgetSection
            id="filter-inversion"
            title="Plan de Inversión"
            data={investmentData}
          />
        </div>
      </div>
    </div>
  );
}

export default Presupuesto;
