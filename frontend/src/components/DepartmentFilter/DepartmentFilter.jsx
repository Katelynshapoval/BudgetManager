const DEPARTMENTS = [
  "Recursos Humanos",
  "Tecnología",
  "Operaciones",
  "Marketing",
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

export default DepartmentFilter;
