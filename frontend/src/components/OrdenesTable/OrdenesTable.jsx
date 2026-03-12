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
            <tr key={row.purchase_order_id}>
              <td>tipo</td>
              <td>{row.generated_order_code}</td>
              <td>{row.description}</td>
              <td>{EUR.format(row.order_amount)}</td>

              <td>
                <button
                  className={
                    row.facturas.length === 0 ? "addInvoice" : "viewInvoice"
                  }
                  onClick={() => onInvoices(row)}
                >
                  {row.facturas.length === 0 && showEdit
                    ? "Agregar factura"
                    : `${row.facturas.length} facturas`}
                </button>
              </td>

              <td>{row.order_date}</td>

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
