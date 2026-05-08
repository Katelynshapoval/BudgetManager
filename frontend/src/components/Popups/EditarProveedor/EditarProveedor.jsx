import { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";

function EditarProveedor({ hidePopup, isOpen, proveedor, onUpdate }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [taxId, setTaxId] = useState("");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (!proveedor) return;
		setName(proveedor.name || "");
		setEmail(proveedor.email || "");
		setPhone(proveedor.phone || "");
		setTaxId(proveedor.taxId || "");
		setNotes(proveedor.notes || "");
	}, [proveedor]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name.trim() || !email.trim()) return;

		if (onUpdate) {
			await onUpdate({
				supplierId: proveedor.supplierId,
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim(),
				taxId: taxId.trim(),
				notes: notes.trim(),
			});
		}
	};

	return (
		<Modal
			title="Editar Proveedor"
			onClose={hidePopup}
			isOpen={isOpen}
			onSubmit={handleSubmit}
			submitLabel="Guardar cambios">
			<div className="popupInputContainer">
				<label htmlFor="nombreProveedor">Nombre</label>
				<input
					id="nombreProveedor"
					type="text"
					className="input"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>

			<div className="popupInputContainer">
				<label htmlFor="correoProveedor">Email</label>
				<input
					id="correoProveedor"
					type="email"
					className="input"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>

			<div className="popupInputContainer">
				<label htmlFor="identificacionFiscal">Identificación fiscal</label>
				<input
					id="identificacionFiscal"
					type="text"
					className="input"
					value={taxId}
					onChange={(e) => setTaxId(e.target.value)}
				/>
			</div>

			<div className="popupInputContainer">
				<label htmlFor="notasProveedor">Notas</label>
				<input
					id="notasProveedor"
					type="text"
					className="input"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				/>
			</div>
		</Modal>
	);
}

export default EditarProveedor;
