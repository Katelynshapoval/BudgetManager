export async function getOrders() {
  const res = await fetch(`/api/purchase-orders`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
