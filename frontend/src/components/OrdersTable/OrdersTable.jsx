import { IoCreateOutline, IoEyeOutline, IoTrashOutline } from "react-icons/io5";
import { EUR } from "../../utils/currency";

function OrdersTable({
  ordenes,
  onViewDetails,
  onInvoices,
  onDelete,
  showDelete = false,
}) {
  return (
    <div className="hideHorizontalScroll">
      <table className="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Importe</th>
            <th>Facturas</th>
            <th>Fecha</th>
            <th className="actionCell">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ordenes.map((row) => {
            // Calculate total invoice amount
            const totalAmount = row.invoices.reduce(
              (sum, inv) => sum + (inv.amount || 0),
              0,
            );

            const invoiceCount = row.invoices.length;
            const hasInvoices = invoiceCount > 0;

            // Determine invoice status
            const isComplete = totalAmount >= row.orderAmount;
            const isPartial = hasInvoices && !isComplete;

            // Button styling based on invoice state
            let buttonClass =
              "viewInvoice bg-red-100 text-red-700 border-red-300";

            if (hasInvoices) {
              if (isComplete) {
                buttonClass =
                  "viewInvoice bg-green-100 text-green-700 border-green-300";
              } else if (isPartial) {
                buttonClass =
                  "viewInvoice bg-yellow-100 text-yellow-700 border-yellow-300";
              }
            }

            // Handle singular/plural label
            const facturaText = invoiceCount === 1 ? "factura" : "facturas";

            let label = "0 facturas";

            if (hasInvoices) {
              if (isComplete) {
                label = `${invoiceCount} ${facturaText} (completo)`;
              } else if (isPartial) {
                label = `${invoiceCount} ${facturaText} (${EUR.format(
                  totalAmount,
                )})`;
              } else {
                label = `${invoiceCount} ${facturaText}`;
              }
            }

            return (
              <tr key={row.purchaseOrderId}>
                {/* Type */}
                <td>{row.generatedOrderCode ? "Presupuesto" : "Inversión"}</td>

                {/* Code */}
                <td>{row.generatedOrderCode || row.investmentPlanCode}</td>

                {/* Description */}
                <td>{row.notes}</td>

                {/* Amount */}
                <td>{EUR.format(row.orderAmount)}</td>

                {/* Invoices */}
                <td>
                  <button
                    className={buttonClass}
                    onClick={() => onInvoices(row)}
                  >
                    {label}
                  </button>
                </td>

                {/* Date */}
                <td>{row.orderDate}</td>

                {/* Actions */}
                <td className="actionCell">
                  {showDelete && onDelete && (
                    <IoTrashOutline
                      className="tableActionIcon"
                      onClick={() => onDelete(row)}
                      title="Eliminar"
                    />
                  )}

                  <IoEyeOutline
                    className="tableActionIcon"
                    onClick={() => onViewDetails(row)}
                    title="Info"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
