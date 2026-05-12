import Modal from "../../Modal/Modal";
import "./DetallesOrden.css";
import { formatDateTime } from "../../../utils/date";
import { EUR } from "../../../utils/currency";

function DetallesOrden({ hidePopup, isOpen, data }) {
  return (
    <Modal title="Info" onClose={hidePopup} isOpen={isOpen} footer={null}>
      {/* Order details */}
      <div className="grid grid-cols-2 gap-6 rounded-lg bg-secondary/60 p-5 text-sm">
        {/* Order id */}
        <div className="detailsPopupField">
          <p>ID de Orden</p>
          <span>{data.generatedOrderCode || data.investmentPlanCode}</span>
        </div>

        {/* Total amount */}
        <div className="detailsPopupField">
          <p>Cantidad Total</p>
          <span>{EUR.format(data.orderAmount)}</span>
        </div>

        {/* Order date */}
        <div className="detailsPopupField">
          <p>Fecha de Orden</p>
          <span>{data.orderDate}</span>
        </div>

        {/* Supplier */}
        <div className="detailsPopupField">
          <p>Proveedor</p>
          <span>{data.supplierName}</span>
        </div>

        {/* Created by */}
        <div className="detailsPopupField">
          <p>Creado por</p>
          <span>{data.createdByName}</span>
        </div>

        {/* Created date */}
        <div className="detailsPopupField">
          <p>Fecha de Creación</p>
          <span>{formatDateTime(data.createdAt)}</span>
        </div>

        {/* Department */}
        <div className="detailsPopupField">
          <p>Departamento</p>
          <span>{data.departmentName}</span>
        </div>

        {/* Funds origin */}
        <div className="detailsPopupField">
          <p>Origen de Fondos</p>
          <span>{data.generatedOrderCode ? "Presupuesto" : "Inversión"}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2 text-sm font-normal">
        <p className="text-xs text-primary">Observaciones</p>
        <p className="rounded-lg bg-secondary/60 p-3">{data.notes}</p>
      </div>
    </Modal>
  );
}

export default DetallesOrden;
