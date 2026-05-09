export async function updateBudget(budgetId, allocated) {
  const res = await fetch(`/api/budgets/${budgetId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ allocated }),
  });

  if (!res.ok) throw new Error("Failed to update budget");

  return res.json();
}

export async function fetchBudgets(year, type) {
  const res = await fetch(
    `/api/budgets?year=${year}&type=${encodeURIComponent(type)}`,
  );
  return res.json();
}

export async function fetchAvailableDepartments(year, type) {
  const res = await fetch(
    `/api/budgets?year=${year}&type=${encodeURIComponent(type)}&available=true`,
  );

  if (!res.ok) throw new Error("Failed to fetch available departments");

  return res.json();
}

export async function createBudget({ allocated, departmentId, year, type }) {
  const res = await fetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ allocated, departmentId, year, type }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to create budget");
  }

  return res.json();
}
