import { useState, useEffect } from "react";

function DepartmentFilter({ id, value, onChange }) {
  const [departments, setDepartments] = useState([]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/departments");
        const data = await res.json();
        setDepartments(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchDepartments();
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
