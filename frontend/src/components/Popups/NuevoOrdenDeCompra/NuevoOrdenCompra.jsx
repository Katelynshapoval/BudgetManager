import Modal from "../../Modal/Modal";

function NuevoOrdenDeCompra({ hidePopup, isOpen }) {
  return (
    <Modal title="Crear un Órden de Compra" onClose={hidePopup} isOpen={isOpen}>
      <div className="popupInputContainer">
        <label htmlFor="nombreOrden">Nombre</label>
        <input id="nombreOrden" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="correoOrden">Correo</label>
        <input id="correoOrden" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="telefonoOrden">Teléfono</label>
        <input id="telefonoOrden" type="text" className="input" />
      </div>
    </Modal>
  );
}

export default NuevoOrdenDeCompra;
