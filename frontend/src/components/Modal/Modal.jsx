import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useClickOutside } from "../../hooks/useClickOutside";

function Modal({
  title,
  onClose,
  isOpen,
  children,
  onSubmit,
  submitLabel = "Crear",
  footer,
}) {
  const ref = useRef(null);
  useClickOutside(ref, isOpen, onClose);

  return (
    <div className="modalOverlay">
      <form
        ref={ref}
        onSubmit={onSubmit}
        className="bg-background p-8 rounded-lg flex flex-col gap-4 md:w-110 lg:w-140"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="mb-0">{title}</h2>
          <IoMdClose
            className="text-light text-2xl md:text-3xl cursor-pointer hover:text-text"
            onClick={onClose}
          />
        </div>

        {children}

        {/* Default footer or custom one */}
        {footer !== undefined ? (
          footer
        ) : (
          <div className="flex justify-center md:justify-end gap-4 mt-2">
            <button
              className="popupButton border-primary outline-none text-primary hover:text-accent hover:border-accent"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="popupButton border-none outline-none bg-accent text-text hover:bg-primary hover:text-background"
              type="submit"
            >
              {submitLabel}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Modal;
