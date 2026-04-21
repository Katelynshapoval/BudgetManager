export async function getOrders() {
  const res = await fetch(`http://localhost:8080/api/purchase-orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
