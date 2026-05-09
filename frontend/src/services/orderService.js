// Fetch all purchase orders
export async function getOrders() {
  const res = await fetch("/api/purchase-orders", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

// Fetch the next generated order code before creating the order
export async function getOrderPreview(budgetId, isFungible) {
  const params = new URLSearchParams({
    budgetId,
    isFungible,
  });

  const res = await fetch(`/api/purchase-orders/preview?${params}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch preview");
  }

  return res.json();
}

// Send the purchase order data to the backend
export async function createPurchaseOrder(payload) {
  const res = await fetch("/api/purchase-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to create purchase order");
  }

  return res.json();
}

// Delete one purchase order by id
export async function deletePurchaseOrder(orderId) {
  const params = new URLSearchParams({
    id: orderId,
  });

  const res = await fetch(`/api/purchase-orders?${params}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete purchase order");
  }

  return res.json();
}
