export async function fetchDepartments() {
  const res = await fetch("http://localhost:8080/api/departments");

  if (!res.ok) throw new Error("Error fetching departments");

  return res.json();
}

export async function fetchRoles() {
  const res = await fetch("http://localhost:8080/api/roles");

  if (!res.ok) throw new Error("Error fetching roles");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
