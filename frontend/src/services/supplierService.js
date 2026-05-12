// Fetch suppliers with optional filters
export async function getSuppliers({ departmentId, all } = {}) {
  let url = "/api/suppliers";
  const params = new URLSearchParams();

  // Add filter parameters when provided
  if (departmentId) {
    params.append("departmentId", departmentId);
  }

  if (all) {
    params.append("all", "true");
  }

  // Add query parameters to the request url
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return response.json();
}

// Create a new supplier
export async function createSupplier({
  name,
  email,
  phone,
  taxId,
  notes,
  shared,
}) {
  const response = await fetch("/api/suppliers", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      taxId,
      notes,
      shared,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create supplier");
  }

  return response.json();
}

// Update an existing supplier
export async function updateSupplier(
  supplierId,
  { name, email, phone, taxId, notes },
) {
  const url = `/api/suppliers?id=${supplierId}`;

  const response = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      taxId,
      notes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update supplier");
  }

  return response.json();
}

// Assign a provider to a department
export async function assignProviderToDepartment({ providerId, departmentId }) {
  const response = await fetch("/api/suppliers/assign", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      providerId,
      departmentId: Number(departmentId),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
      return {
        error: "already_assigned",
        message: data.error,
      };
    }

    throw new Error("Failed to assign provider to department");
  }

  return data;
}
