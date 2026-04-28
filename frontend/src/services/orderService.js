export async function getOrders() {
  const res = await fetch(`/api/purchase-orders`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrderPreview(budgetId, isFungible) {
  const res = await fetch(
    `/api/purchase-orders/preview?budgetId=${budgetId}&isFungible=${isFungible}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch preview");
  return res.json();
}
