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
          {ordenes.map((row) => (
            <tr key={row.purchaseOrderId}>
              <td>{row.generatedOrderCode ? "Presupuesto" : "Inversión"}</td>

              <td>{row.generatedOrderCode || row.investmentPlanCode}</td>

              <td>{row.notes}</td>

              <td>{EUR.format(row.orderAmount)}</td>

              <td>
                <button
                  className={
                    row.invoices.length === 0 ? "addInvoice" : "viewInvoice"
                  }
                  onClick={() => onInvoices(row)}
                >
                  {row.invoices.length === 0 && showEdit
                    ? "Agregar factura"
                    : `${row.invoices.length} ${row.invoices.length === 1 ? "factura" : "facturas"}`}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdenesTable;
