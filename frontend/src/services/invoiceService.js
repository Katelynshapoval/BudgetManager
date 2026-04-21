export async function uploadInvoice({ file, amount, purchaseOrderId }) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("amount", amount);
  formData.append("purchase_order_id", purchaseOrderId);

  const res = await fetch(`http://localhost:8080/api/invoices/file`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload invoice");

  return res.text();
}

export async function deleteInvoice(id) {
  const res = await fetch(`http://localhost:8080/api/invoices/file?id=${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete invoice");

  return res.text();
}
