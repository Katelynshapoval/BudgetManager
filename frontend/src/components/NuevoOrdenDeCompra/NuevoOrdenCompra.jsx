import { IoMdClose } from "react-icons/io";
import { useRef, useEffect } from "react";

function NuevoOrdenDeCompra({ hidePopup, popupStatus }) {
  const popupRef = useRef(null);

  // Close the menu if clicked outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupStatus &&
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
  }, [popupStatus, hidePopup]);
  return (
    <div className="modalOverlay">
      <form
        ref={popupRef}
        className="bg-background p-8 rounded-lg flex flex-col gap-4 md:w-110 lg:w-140"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="mb-0">Agregar un Órden de Compra</h2>
          <IoMdClose
            className="text-light text-2xl md:text-3xl cursor-pointer hover:text-text"
            onClick={() => hidePopup()}
          />
        </div>

        <div className="popupInputContainer">
          <label htmlFor="nombreProveedor">Nombre</label>
          <input id="nombreProveedor" type="text" className="input" />
        </div>

        <div className="popupInputContainer">
          <label htmlFor="correoProveedor">Correo</label>
          <input id="correoProveedor" type="text" className="input" />
        </div>

        <div className="popupInputContainer">
          <label htmlFor="telefonoProveedor">Teléfono</label>
          <input id="telefonoProveedor" type="text" className="input" />
        </div>

        <div className="flex justify-center md:justify-end gap-4 mt-2">
          <button
            className="popupButton border-primary outline-none text-primary hover:text-accent hover:border-accent"
            type="button"
          >
            Cancelar
          </button>
          <button
            className="popupButton border-none outline-none bg-accent text-text hover:bg-primary hover:text-background"
            id="submitButton"
            type="submit"
          >
            Añadir
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoOrdenDeCompra;
