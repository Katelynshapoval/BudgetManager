import { useState, useEffect } from "react";
import { fetchDepartments } from "../../services/metaService";

function DepartmentFilter({ id, value, onChange }) {
  const [departments, setDepartments] = useState([]);

  // Fetch departments
  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  return (
    <div className="filter">
      <label htmlFor={id} className="text-primary">
        Filtrar por departamento:
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>
        {departments.map((d) => (
          <option key={d.departmentId} value={d.departmentId}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DepartmentFilter;
