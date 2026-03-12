import { useRef, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaRegFileAlt } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { useLocation } from "react-router-dom";

// Sub-components

function InvoiceItem({ file, amount }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary bg-secondary/60 px-5 py-3 text-sm text-primary">
      <FaRegFileAlt className="text-lg" />

      <div className="flex-1">
        <p className="text-text">{file}</p>
        <p className="font-light">Importe: {amount}</p>
      </div>

      <div className="flex gap-4 text-lg">
        <RiEditLine className="cursor-pointer" />
        <MdDeleteOutline className="cursor-pointer" />
      </div>
    </div>
  );
}

function InvoiceList({ invoices }) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg bg-secondary/60 p-5 text-center text-sm font-normal">
        No hay facturas adjuntas
      </div>
    );
  }

  return (
    <div className="flex max-h-50 flex-col gap-2 overflow-y-auto">
      {invoices.map((invoice, index) => (
        <InvoiceItem key={index} file={invoice.file} amount={invoice.amount} />
      ))}
    </div>
  );
}

function AddInvoiceForm({ onCancel }) {
  return (
    <div className="flex flex-col justify-center gap-4 rounded-xl bg-secondary/60 p-5 md:justify-end">
      <div className="w-full">
        <label
          htmlFor="factura"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-dashed border-accent bg-secondary px-6 py-4 text-text transition hover:border-accent hover:bg-accent/10"
        >
          <MdOutlineFileUpload className="text-xl text-accent" />
          <span className="text-sm font-medium">Seleccionar archivo...</span>
        </label>

        <input id="factura" type="file" accept=".pdf" className="hidden" />
      </div>

      <div className="inputContainer">
        <label htmlFor="amount" className="font-normal text-primary">
          Importe de la factura
        </label>
        <input
          id="amount"
          type="text"
          required
          className="bg-background p-2 text-sm"
          placeholder="0.00€"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="popupButton flex-1 border-primary text-sm text-primary outline-none hover:border-accent hover:text-accent"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="popupButton flex-1 border-none bg-accent text-sm text-text outline-none hover:bg-primary hover:text-background"
        >
          Crear
        </button>
      </div>
    </div>
  );
}

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

// Main component

function AgregarFacturaPopup({ hidePopup, popupStatus, data, hide }) {
  const popupRef = useRef(null);
  const [showAddFile, setShowAddFile] = useState(false);
  const isHistorico = hide ? true : false;

  useClickOutside(popupRef, popupStatus, hidePopup);

  return (
    <div className="modalOverlay">
      <form
        ref={popupRef}
        className="flex w-85 flex-col gap-6 rounded-lg bg-background p-8 shadow-lg md:w-110 lg:w-140"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Facturas</h2>
          <IoMdClose
            className="cursor-pointer text-2xl text-light transition hover:text-text md:text-3xl"
            onClick={hidePopup}
          />
        </div>

        {/* Invoice list */}
        <InvoiceList invoices={data} />

        {/* Upload button / Add form */}
        {!isHistorico && (
          <>
            {showAddFile ? (
              <AddInvoiceForm onCancel={() => setShowAddFile(false)} />
            ) : (
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-secondary p-3 text-sm transition-all duration-150 hover:bg-accent"
                onClick={() => setShowAddFile(true)}
              >
                <MdOutlineFileUpload className="text-xl" />
                Subir nueva factura
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default AgregarFacturaPopup;
