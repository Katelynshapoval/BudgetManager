export async function getBudgetTypes() {
  const res = await fetch("/api/budget-types", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch budget types");
  return res.json();
}
