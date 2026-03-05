import { IoMdClose } from "react-icons/io";
import "./NuevoProveedor.css";
import { useRef, useEffect } from "react";

function NuevoProveedor({ hidePopup, show }) {
  const popupRef = useRef(null);

  // Close the menu if clicked outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        show &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        hidePopup();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);
  return (
    <div className="modalOverlay">
      <form ref={popupRef} className="popup">
        <div className="headerPopup">
          <h1>Agregar un Proveedor</h1>
          <IoMdClose
            id="closePopupIcon"
            className="lightText"
            onClick={() => hidePopup()}
          />
        </div>

        <div className="inputPopup">
          <label className="lightText" htmlFor="nombreProveedor">
            Nombre
          </label>
          <input id="nombreProveedor" type="text" className="input" />
        </div>

        <div className="inputPopup">
          <label className="lightText" htmlFor="correoProveedor">
            Correo
          </label>
          <input id="correoProveedor" type="text" className="input" />
        </div>

        <div className="inputPopup">
          <label className="lightText" htmlFor="telefonoProveedor">
            Teléfono
          </label>
          <input id="telefonoProveedor" type="text" className="input" />
        </div>

        <div className="popupButtons">
          <button id="cancelButton" type="button">
            Cancelar
          </button>
          <button id="submitButton" type="submit">
            Añadir proveedor
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoProveedor;
