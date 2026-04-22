import Modal from "../../Modal/Modal";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function NuevoOrdenDeCompra({ hidePopup, isOpen }) {
  const [proveedores, setProveedores] = useState([]);

  return (
    <Modal title="Crear un Órden de Compra" onClose={hidePopup} isOpen={isOpen}>
      <div className="popupInputContainer">
        <label htmlFor="cantidadOrden">Proveedor</label>
        <input id="cantidadOrden" type="number" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="cantidadOrden">Cantidad</label>
        <input id="cantidadOrden" type="number" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="descripcionOrden">Descripción</label>
        <input id="descripcionOrden" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="fechaOrden">Fecha de Orden</label>
        <input id="fechaOrden" type="date" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="fungibleOrden">Fungible</label>
        <input id="fungibleOrden" type="checkbox" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="tipoPresupuesto">Origen de Fondos</label>
        <input id="tipoPresupuesto" type="checkbox" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="tipoPresupuesto">Facturas (opcional)</label>
        <input id="tipoPresupuesto" type="checkbox" className="input" />
      </div>
    </Modal>
  );
}

export default NuevoOrdenDeCompra;
