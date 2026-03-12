import Modal from "../../Modal/Modal";
import "./DetallesOrden.css";
function DetallesOrden({ hidePopup, isOpen, data }) {
  return (
    <Modal title="Info" onClose={hidePopup} isOpen={isOpen} footer={null}>
      <div className="grid grid-cols-2 gap-6 bg-secondary/60 p-5 rounded-lg text-sm">
        <div className="detailsPopupField">
          <p>ID de Orden</p>
          <span>{data.generated_order_code}</span>
        </div>

        <div className="detailsPopupField">
          <p>Cantidad Total</p>
          <span>${data.order_amount}</span>
        </div>

        <div className="detailsPopupField">
          <p>Fecha de Orden</p>
          <span>{data.order_date}</span>
        </div>

        <div className="detailsPopupField">
          <p>Proveedor</p>
          <span>{data.supplier_name}</span>
        </div>

        <div className="detailsPopupField">
          <p>Creado por</p>
          <span>{data.created_by_name}</span>
        </div>

        <div className="detailsPopupField">
          <p>Fecha de Creación</p>
          <span>{data.created_at}</span>
        </div>

        <div className="detailsPopupField">
          <p>Departamento</p>
          <span>{data.department}</span>
        </div>

        <div className="detailsPopupField">
          <p>Origen de Fondos</p>
          <span>{data.investment_plan_code}</span>
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
