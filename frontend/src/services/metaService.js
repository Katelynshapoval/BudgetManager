export async function fetchDepartments() {
  const res = await fetch("/api/departments");

  if (!res.ok) throw new Error("Error fetching departments");

  return res.json();
}

export async function fetchRoles() {
  const res = await fetch("/api/roles");

  if (!res.ok) throw new Error("Error fetching roles");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
