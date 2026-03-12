import Modal from "../../Modal/Modal";

function NuevoProveedor({ hidePopup, isOpen }) {
  return (
    <Modal
      title="Agregar un Proveedor"
      onClose={hidePopup}
      isOpen={isOpen}
      submitLabel="Añadir"
    >
      <div className="popupInputContainer">
        <label htmlFor="nombreProveedor">Nombre</label>
        <input id="nombreProveedor" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="correoProveedor">Email</label>
        <input id="correoProveedor" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="telefonoProveedor">Teléfono</label>
        <input id="telefonoProveedor" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="identificacionFiscal">Identificación fiscal</label>
        <input id="identificacionFiscal" type="text" className="input" />
      </div>

      <div className="popupInputContainer">
        <label htmlFor="notasProveedor">Notas</label>
        <input id="notasProveedor" type="text" className="input" />
      </div>
    </Modal>
  );
}

export default NuevoProveedor;
