export async function getSuppliers({ departmentId, all } = {}) {
  let url = "/api/suppliers";

  const params = new URLSearchParams();

  if (departmentId) params.append("departmentId", departmentId);
  if (all) params.append("all", "true");

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch suppliers");
  return res.json();
}

export async function assignProviderToDepartment({ providerId, departmentId }) {
  const res = await fetch("/api/suppliers/assign", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      providerId,
      departmentId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to assign provider to department");
  }

  return res.json();
}
