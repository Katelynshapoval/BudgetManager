import Modal from "../../Modal/Modal";
import "./DetallesOrden.css";
import { formatDateTime } from "../../../utils/date";
import { EUR } from "../../../utils/currency";
function DetallesOrden({ hidePopup, isOpen, data }) {
  console.log(data);
  return (
    <Modal title="Info" onClose={hidePopup} isOpen={isOpen} footer={null}>
      <div className="grid grid-cols-2 gap-6 bg-secondary/60 p-5 rounded-lg text-sm">
        <div className="detailsPopupField">
          <p>ID de Orden</p>
          <span>{data.generatedOrderCode || data.investmentPlanCode}</span>
        </div>

        <div className="detailsPopupField">
          <p>Cantidad Total</p>
          <span>{EUR.format(data.orderAmount)}</span>
        </div>

        <div className="detailsPopupField">
          <p>Fecha de Orden</p>
          <span>{data.orderDate}</span>
        </div>

        <div className="detailsPopupField">
          <p>Proveedor</p>
          <span>{data.supplierName}</span>
        </div>

        <div className="detailsPopupField">
          <p>Creado por</p>
          <span>{data.createdByName}</span>
        </div>

        <div className="detailsPopupField">
          <p>Fecha de Creación</p>
          <span>{formatDateTime(data.createdAt)}</span>
        </div>

        <div className="detailsPopupField">
          <p>Departamento</p>
          <span>{data.departmentName}</span>
        </div>

        <div className="detailsPopupField">
          <p>Origen de Fondos</p>
          <span>{data.generatedOrderCode ? "Presupuesto" : "Inversión"}</span>
        </div>
      </div>

      <div className="text-sm font-normal space-y-2">
        <p className="text-xs text-primary">Observaciones</p>
        <p className="bg-secondary/60 p-3 rounded-lg">{data.notes}</p>
      </div>
    </Modal>
  );
}

export default DetallesOrden;
