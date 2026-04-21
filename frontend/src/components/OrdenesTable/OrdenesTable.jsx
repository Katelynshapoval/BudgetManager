import { RiEditLine, RiInfoI } from "react-icons/ri";
import { EUR } from "../../utils/currency";

function OrdenesTable({
  ordenes,
  onViewDetails,
  onInvoices,
  showEdit = false,
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
            // total amount from all invoices
            const totalFacturas = row.invoices.reduce(
              (sum, inv) => sum + (inv.amount || 0),
              0,
            );

            const count = row.invoices.length;
            const hasInvoices = count > 0;
            const isComplete = totalFacturas >= row.orderAmount;
            const isPartial = hasInvoices && !isComplete;

            // default = red (no invoices or incomplete)
            let buttonClass =
              "viewInvoice bg-red-100 text-red-700 border-red-300";

            if (hasInvoices) {
              if (isComplete) {
                // fully covered
                buttonClass =
                  "viewInvoice bg-green-100 text-green-700 border-green-300";
              } else if (isPartial) {
                // partially covered
                buttonClass =
                  "viewInvoice bg-yellow-100 text-yellow-700 border-yellow-300";
              }
            }

            // handle singular/plural
            const facturaText = count === 1 ? "factura" : "facturas";

            let label = "";
            if (!hasInvoices) {
              label = "0 facturas";
            } else if (isComplete) {
              label = `${count} ${facturaText} (completo)`;
            } else if (isPartial) {
              label = `${count} ${facturaText} (${EUR.format(totalFacturas)})`;
            } else {
              label = `${count} ${facturaText}`;
            }

            return (
              <tr key={row.purchaseOrderId}>
                <td>{row.generatedOrderCode ? "Presupuesto" : "Inversión"}</td>

                <td>{row.generatedOrderCode || row.investmentPlanCode}</td>

                <td>{row.notes}</td>

                <td>{EUR.format(row.orderAmount)}</td>

                <td>
                  <button
                    className={buttonClass}
                    onClick={() => onInvoices(row)}
                  >
                    {label}
                  </button>
                </td>

                <td>{row.orderDate}</td>

                <td className="actionCell">
                  {showEdit && <RiEditLine className="tableActionIcon" />}

                  <RiInfoI
                    className="tableActionIcon"
                    onClick={() => onViewDetails(row)}
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

export default OrdenesTable;
