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
  const res = await fetch(`/api/budgets?year=${year}&type=${type}`);
  return res.json();
}
