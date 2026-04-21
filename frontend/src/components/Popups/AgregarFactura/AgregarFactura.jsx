import { useState, useEffect } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import Modal from "../../Modal/Modal";
import { uploadInvoice } from "../../../services/invoiceService";
import { toast } from "sonner";
import { EUR } from "../../../utils/currency";

// Single invoice item
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

        {/* formatted amount */}
        <p className="font-light">Importe: {EUR.format(amount)}</p>
      </div>

      <div className="flex gap-4 text-lg">
        <RiEditLine className="cursor-pointer" />
        <MdDeleteOutline className="cursor-pointer" />
      </div>
    </div>
  );
}

// Form to upload invoice
function AddInvoiceForm({ onCancel, purchaseOrderId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Selecciona un PDF");
      return;
    }

    if (!amount) {
      toast.error("Introduce un importe");
      return;
    }

    try {
      const promise = uploadInvoice({
        file,
        amount: parseFloat(amount),
        purchaseOrderId,
      });

      toast.promise(promise, {
        loading: "Subiendo factura...",
        success: "Factura subida correctamente",
        error: "Error subiendo factura",
      });

      await promise;
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 rounded-xl bg-secondary/60 p-5 md:justify-end">
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
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];

            if (!selectedFile) return;

            if (selectedFile.type !== "application/pdf") {
              toast.error("El archivo debe ser un PDF");
              e.target.value = null;
              setFile(null);
              return;
            }

            setFile(selectedFile);
          }}
        />
      </div>

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
  const [invoices, setInvoices] = useState(data);
  const isHistorico = hide;

  useEffect(() => {
    setInvoices(data);
  }, [data]);

  // total sum of invoices
  const total = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <Modal title="Facturas" onClose={hidePopup} isOpen={isOpen} footer={null}>
      {/* Invoice list */}
      {invoices.length === 0 ? (
        <div className="rounded-lg bg-secondary/60 p-5 text-center text-sm font-normal">
          No hay facturas adjuntas
        </div>
      ) : (
        <div className="flex max-h-50 flex-col gap-2 overflow-y-auto">
          {invoices.map((invoice) => (
            <InvoiceItem
              key={invoice.invoiceId}
              id={invoice.invoiceId}
              amount={invoice.amount}
            />
          ))}
        </div>
      )}

      {/* total summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-primary border-t border-primary/20 pt-3">
        <span>Total facturas</span>
        <span className="font-medium">{EUR.format(total)}</span>
      </div>

      {/* Upload section */}
      {!isHistorico && (
        <>
          {showAddFile ? (
            <AddInvoiceForm
              onCancel={() => setShowAddFile(false)}
              purchaseOrderId={purchaseOrderId}
              onSuccess={async () => {
                setShowAddFile(false);

                const updatedOrders = await onUploadSuccess();
                if (!updatedOrders) return;

                const updatedOrder = updatedOrders.find(
                  (o) => o.purchaseOrderId == purchaseOrderId,
                );

                if (updatedOrder) {
                  setInvoices(updatedOrder.invoices);
                }
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
