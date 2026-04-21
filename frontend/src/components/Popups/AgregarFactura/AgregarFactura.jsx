import { useRef, useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import Modal from "../../Modal/Modal";
import { uploadInvoice } from "../../../services/invoiceService";

// Sub-components

function InvoiceItem({ id, amount }) {
  const handleOpen = () => {
    window.open(`http://localhost:8080/api/invoices/file?id=${id}`, "_blank");
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary bg-secondary/60 px-5 py-3 text-sm text-primary">
      <FaRegFileAlt className="text-lg" />

      <div className="flex-1">
        <button
          onClick={handleOpen}
          className="text-text hover:text-[#252323] text-left cursor-pointer"
        >
          Ver factura #{id}
        </button>
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
        <InvoiceItem
          key={invoice.invoiceId}
          id={invoice.invoiceId}
          amount={invoice.amount}
        />
      ))}
    </div>
  );
}

function AddInvoiceForm({ onCancel, purchaseOrderId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      alert("Selecciona un PDF");
      return;
    }

    if (!amount) {
      alert("Introduce un importe");
      return;
    }

    console.log("UPLOAD DATA:", {
      file,
      amount,
      purchaseOrderId,
    });

    try {
      await uploadInvoice({
        file,
        amount,
        purchaseOrderId,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error subiendo factura");
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 rounded-xl bg-secondary/60 p-5 md:justify-end">
      {/* File */}
      <div className="w-full">
        <label
          htmlFor="factura"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-dashed border-accent bg-secondary px-6 py-4 text-text transition hover:border-accent hover:bg-accent/10"
        >
          <MdOutlineFileUpload className="text-xl text-accent" />
          <span className="text-sm font-medium">
            {file ? file.name : "Seleccionar archivo..."}
          </span>
        </label>

        <input
          id="factura"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Amount */}
      <div className="inputContainer">
        <label className="font-normal text-primary">
          Importe de la factura
        </label>
        <input
          type="number"
          step="0.01"
          required
          className="bg-background p-2 text-sm"
          placeholder="0.00€"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="popupButton flex-1 border-primary text-sm text-primary hover:border-accent hover:text-accent"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="popupButton flex-1 border-none bg-accent text-sm text-text hover:bg-primary hover:text-background"
        >
          Crear
        </button>
      </div>
    </div>
  );
}

// Main component
function AgregarFactura({
  hidePopup,
  isOpen,
  data,
  purchaseOrderId,
  hide,
  onUploadSuccess,
}) {
  const [showAddFile, setShowAddFile] = useState(false);
  const isHistorico = hide ? true : false;

  return (
    <Modal
      title="Facturas"
      onClose={hidePopup}
      isOpen={isOpen}
      footer={null} // removes default footer
    >
      {/* Invoice list */}
      <InvoiceList invoices={data} />

      {/* Upload button / Add form */}
      {!isHistorico && (
        <>
          {showAddFile ? (
            <AddInvoiceForm
              onCancel={() => setShowAddFile(false)}
              purchaseOrderId={purchaseOrderId}
              onSuccess={() => {
                setShowAddFile(false);
                hidePopup();
                onUploadSuccess();
              }}
            />
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
    </Modal>
  );
}

export default AgregarFactura;
