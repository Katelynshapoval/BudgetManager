import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../../Modal/Modal";
import {
	createBudget,
	fetchAvailableDepartments,
} from "../../../services/budgetService";

function CreateBudgetPopup({ hidePopup, isOpen, type, year, onCreated }) {
	const currentYear = new Date().getFullYear();
	const fiscalStartYear = year ?? currentYear;
	const yearOptions = [
		fiscalStartYear,
		fiscalStartYear + 1,
		fiscalStartYear + 2,
	];

	const [allocated, setAllocated] = useState("");
	const [departmentId, setDepartmentId] = useState("");
	const [fiscalYear, setFiscalYear] = useState(fiscalStartYear);
	const [notes, setNotes] = useState("");
	const [departments, setDepartments] = useState([]);
	const [loadingDepartments, setLoadingDepartments] = useState(false);

	const typeLabel =
		type === "plan de inversiones" ? "Plan de Inversión" : "Presupuesto";

	const resetForm = () => {
		setAllocated("");
		setDepartmentId("");
		setFiscalYear(fiscalStartYear);
		setNotes("");
	};

	const loadDepartments = async (targetYear) => {
		setLoadingDepartments(true);

		try {
			const data = await fetchAvailableDepartments(targetYear, type);
			setDepartments(data || []);
			setDepartmentId(data?.[0]?.departmentId ?? "");
		} catch (error) {
			console.error("Error fetching available departments:", error);
			toast.error("Error cargando departamentos disponibles.");
		} finally {
			setLoadingDepartments(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			resetForm();
			loadDepartments(fiscalStartYear);
		}
	}, [isOpen, fiscalStartYear, type]);

	useEffect(() => {
		if (isOpen) {
			loadDepartments(fiscalYear);
		}
	}, [fiscalYear, isOpen, type]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const parsedAllocated = Number(allocated);
		const parsedYear = Number(fiscalYear);

		if (Number.isNaN(parsedAllocated) || parsedAllocated < 0) {
			toast.error("Introduce un importe válido.");
			return;
		}

		if (!departmentId) {
			toast.error("Selecciona un departamento.");
			return;
		}

		if (Number.isNaN(parsedYear) || parsedYear < 2000) {
			toast.error("Introduce un año fiscal válido.");
			return;
		}

		try {
			await createBudget({
				allocated: parsedAllocated,
				departmentId: Number(departmentId),
				year: parsedYear,
				notes: notes.trim(),
				type,
			});

			toast.success(`${typeLabel} creado correctamente.`);
			hidePopup();
			onCreated?.();
		} catch (error) {
			console.error("Error creating budget:", error);
			const errorMessage =
				error?.response?.data?.error ||
				`No se pudo crear ${typeLabel.toLowerCase()}.`;
			toast.error(errorMessage);
		}
	};

	const footer = (
		<div className="flex justify-center md:justify-end gap-4 mt-2">
			<button
				type="button"
				className="popupButton border-primary outline-none text-primary hover:text-accent hover:border-accent"
				onClick={hidePopup}>
				Cancelar
			</button>
			<button
				type="submit"
				disabled={departments.length === 0}
				className="popupButton border-none outline-none bg-accent text-text hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-60">
				Crear
			</button>
		</div>
	);

	return (
		<Modal
			title={`Crear ${typeLabel}`}
			onClose={hidePopup}
			isOpen={isOpen}
			onSubmit={handleSubmit}
			footer={footer}>
			<div className="popupInputContainer">
				<label htmlFor="allocatedAmount">Dinero asignado</label>
				<input
					id="allocatedAmount"
					type="number"
					min="0"
					step="0.01"
					className="input"
					value={allocated}
					onChange={(e) => setAllocated(e.target.value)}
					placeholder="0.00"
					required
				/>
			</div>

			<div className="popupInputContainer">
				<label htmlFor="departmentSelect">Departamento</label>
				<select
					id="departmentSelect"
					className="select"
					value={departmentId}
					onChange={(e) => setDepartmentId(e.target.value)}
					disabled={loadingDepartments || departments.length === 0}
					required>
					{departments.length === 0 ? (
						<option value="">No hay departamentos disponibles</option>
					) : (
						<>
							<option value="">Selecciona un departamento</option>
							{departments.map((department) => (
								<option
									key={department.departmentId}
									value={department.departmentId}>
									{department.name}
								</option>
							))}
						</>
					)}
				</select>
			</div>

			<div className="popupInputContainer">
				<label htmlFor="fiscalYear">Año fiscal</label>
				<select
					id="fiscalYear"
					className="select"
					value={fiscalYear}
					onChange={(e) => setFiscalYear(Number(e.target.value))}
					required>
					<option value="">Selecciona un año fiscal</option>
					{yearOptions.map((optionYear) => (
						<option key={optionYear} value={optionYear}>
							{optionYear}
						</option>
					))}
				</select>
			</div>

			<div className="popupInputContainer">
				<label htmlFor="budgetNotes">Notas</label>
				<input
					id="budgetNotes"
					type="text"
					className="input"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="Descripción"
				/>
			</div>
		</Modal>
	);
}

export default CreateBudgetPopup;
