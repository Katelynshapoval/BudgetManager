// Upload an invoice file
export async function uploadInvoice({ file, amount, purchaseOrderId }) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("amount", amount);
  formData.append("purchase_order_id", purchaseOrderId);

  const response = await fetch("/api/invoices/file", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload invoice");
  }

  return response.text();
}

// Delete an invoice file
export async function deleteInvoice(id) {
  const response = await fetch(`/api/invoices/file?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete invoice");
  }

  return response.text();
}
