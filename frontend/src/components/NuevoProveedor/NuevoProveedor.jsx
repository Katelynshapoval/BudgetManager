import { useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

// Hooks

function useClickOutside(ref, isActive, onClose) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (isActive && ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, isActive, onClose]);
}

// Constants

const FIELDS = [
  { id: "nombreProveedor", label: "Nombre", type: "text" },
  { id: "correoProveedor", label: "Email", type: "email" },
  { id: "telefonoProveedor", label: "Teléfono", type: "tel" },
  { id: "fiscalProveedor", label: "Identificación fiscal", type: "text" },
  { id: "notasProveedor", label: "Notas", type: "text" },
];

// Sub-components

function FormField({ id, label, type }) {
  return (
    <div className="popupInputContainer">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} className="input" />
    </div>
  );
}

// Main component

function NuevoProveedor({ hidePopup, popupStatus }) {
  const popupRef = useRef(null);

  useClickOutside(popupRef, popupStatus, hidePopup);

  return (
    <div className="modalOverlay">
      <form
        ref={popupRef}
        className="flex flex-col gap-4 rounded-lg bg-background p-6 md:p-8 w-80 md:w-110 lg:w-140"
      >
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="mb-0">Agregar un Proveedor</h2>
          <IoMdClose
            className="cursor-pointer text-2xl text-light hover:text-text md:text-3xl"
            onClick={hidePopup}
          />
        </div>

        {/* Form fields */}
        {FIELDS.map((field) => (
          <FormField key={field.id} {...field} />
        ))}

        {/* Actions */}
        <div className="mt-2 flex justify-center gap-4 md:justify-end">
          <button
            className="popupButton border-primary text-primary outline-none hover:border-accent hover:text-accent"
            type="button"
            onClick={hidePopup}
          >
            Cancelar
          </button>
          <button
            className="popupButton border-none bg-accent text-text outline-none hover:bg-primary hover:text-background"
            type="submit"
          >
            Añadir
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoProveedor;
