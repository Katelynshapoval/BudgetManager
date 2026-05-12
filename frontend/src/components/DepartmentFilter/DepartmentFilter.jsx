import { useState, useEffect } from "react";
import { fetchDepartments } from "../../services/metaService";

function DepartmentFilter({ id, value, onChange }) {
  const [departments, setDepartments] = useState([]);

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  return (
    <div className="filter">
      {/* Filter label */}
      <label htmlFor={id} className="text-primary">
        Filtrar por departamento:
      </label>

      {/* Department select */}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>

        {departments.map((department) => (
          <option key={department.departmentId} value={department.departmentId}>
            {department.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DepartmentFilter;
