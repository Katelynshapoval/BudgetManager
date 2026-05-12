// Update an existing budget
export async function updateBudget(budgetId, allocated) {
  const response = await fetch(`/api/budgets/${budgetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ allocated }),
  });

  if (!response.ok) {
    throw new Error("Failed to update budget");
  }

  return response.json();
}

// Fetch budgets by year and type
export async function fetchBudgets(year, type) {
  const response = await fetch(
    `/api/budgets?year=${year}&type=${encodeURIComponent(type)}`,
  );

  return response.json();
}

// Fetch departments without a budget
export async function fetchAvailableDepartments(year, type) {
  const response = await fetch(
    `/api/budgets?year=${year}&type=${encodeURIComponent(type)}&available=true`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch available departments");
  }

  return response.json();
}

// Create a new budget
export async function createBudget({ allocated, departmentId, year, type }) {
  const response = await fetch("/api/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ allocated, departmentId, year, type }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new Error(body.error || "Failed to create budget");
  }

  return response.json();
}
