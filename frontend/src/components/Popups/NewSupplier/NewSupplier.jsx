import { useState } from "react";
import Modal from "../../Modal/Modal";

function NewSupplier({ hidePopup, isOpen, onCreate }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [taxId, setTaxId] = useState("");
	const [notes, setNotes] = useState("");
	const [shared, setShared] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name.trim() || !email.trim()) return;

		if (onCreate) {
			await onCreate({
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim(),
				taxId: taxId.trim(),
				notes: notes.trim(),
				shared,
			});
		}
	};

	return (
		<Modal
			title="Agregar un Proveedor"
			onClose={hidePopup}
			isOpen={isOpen}
			onSubmit={handleSubmit}
			submitLabel="Añadir">

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
				<label htmlFor="telefonoProveedor">Teléfono</label>
				<input
					id="telefonoProveedor"
					type="text"
					className="input"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
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

			<div className="flex items-center justify-end gap-3">
				<label htmlFor="compartidoProveedor" className="text-sm text-primary">
					Proveedor compartido
				</label>
				<input
					id="compartidoProveedor"
					type="checkbox"
					checked={shared}
					onChange={(e) => setShared(e.target.checked)}
					className="focus:ring-0 w-4 h-4"
				/>
			</div>
		</Modal>
	);
}

export default NewSupplier;
