import { useState, useEffect, useContext } from "react";
import {
	IoSearchOutline,
	IoAddOutline,
	IoCheckmarkCircleOutline,
	IoTrashOutline,
	IoCreateOutline,
} from "react-icons/io5";

import AssignDepartment from "../../components/Popups/AssignDepartment/AssignDepartment";
import NewSupplier from "../../components/Popups/NewSupplier/NewSupplier.jsx";
import EditSupplier from "../../components/Popups/EditSupplier/EditSupplier.jsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import {
	getSuppliers,
	assignProviderToDepartment,
	createSupplier,
	updateSupplier,
} from "../../services/supplierService";
import { fetchDepartments } from "../../services/metaService";

import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

// Table headers
const COLUMN_HEADERS = [
	"Nombre",
	"Email",
	"Teléfono",
	"Identificación fiscal",
	"Notas",
];

// Total columns (including actions column)
const TOTAL_COLUMNS = COLUMN_HEADERS.length + 1;

// Delete supplier helper
const deleteSupplier = async (id, setSuppliers) => {
	if (!window.confirm("¿Estás seguro de borrar este proveedor?")) return;

	try {
		const response = await fetch(`/api/suppliers?id=${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		if (response.ok) {
			setSuppliers((prev) => prev.filter((s) => s.supplierId !== id));
			toast.success("Proveedor eliminado correctamente");
		} else {
			toast.error("Error al eliminar el proveedor");
		}
	} catch (error) {
		console.error(error);
		toast.error("Error de conexión al servidor");
	}
};

// Single row component
function ProveedorRow({
	proveedor,
	setProveedores,
	canEdit,
	assignProvider,
	onEdit,
}) {
	return (
		<tr>
			<td>{proveedor.name}</td>
			<td>{proveedor.email}</td>
			<td>{proveedor.phone}</td>
			<td>{proveedor.taxId}</td>
			<td>{proveedor.notes}</td>

			{canEdit && (
				<td className="actionCell">
					<IoCreateOutline
						className="tableActionIcon"
						onClick={() => onEdit(proveedor)}
						title="Editar"
					/>

					<IoTrashOutline
						className="tableActionIcon"
						onClick={() => deleteSupplier(proveedor.supplierId, setProveedores)}
						title="Eliminar"
					/>

					{!proveedor.isShared && (
						<IoCheckmarkCircleOutline
							className="tableActionIcon"
							onClick={() => assignProvider(proveedor.supplierId)}
							title="Asignar"
						/>
					)}
				</td>
			)}
		</tr>
	);
}

// Main component
function Proveedor() {
	// Suppliers data
	const [proveedores, setProveedores] = useState([]);
	const [loading, setLoading] = useState(true);

	// UI state
	const [search, setSearch] = useState("");
	const [addProveedorShow, setAddProveedorShow] = useState(false);
	const [editProveedorShow, setEditProveedorShow] = useState(false);
	const [selectedSupplier, setSelectedSupplier] = useState(null);

	// Assignment popup state
	const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);
	const [selectedProviderId, setSelectedProviderId] = useState(null);

	// Departments metadata
	const [departments, setDepartments] = useState([]);

	// Auth
	const { user } = useContext(AuthContext);
	const canEdit = user.roleName !== "contable";

	// Filter suppliers by search
	const filteredProveedores = proveedores.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()),
	);

	// Load suppliers from API
	const loadSuppliers = async () => {
		try {
			setLoading(true);
			const data = await getSuppliers({ all: true });
			console.log(data);
			setProveedores(data);
		} catch (err) {
			console.error("Error fetching suppliers:", err);
		} finally {
			setLoading(false);
		}
	};

	// Load departments from API
	const loadDepartments = async () => {
		try {
			const data = await fetchDepartments();
			setDepartments(data);
		} catch (err) {
			console.error("Error fetching departments:", err);
		}
	};

	const handleCreateSupplier = async (supplierPayload) => {
		try {
			await createSupplier(supplierPayload);
			await loadSuppliers();
			setAddProveedorShow(false);
			toast.success("Proveedor creado correctamente");
		} catch (err) {
			console.error(err);
			toast.error("Error al crear el proveedor");
		}
	};

	// Initial load
	useEffect(() => {
		const fetchData = async () => {
			await loadSuppliers();
			await loadDepartments();
		};
		fetchData();
	}, []);

	const openEditProveedor = (supplier) => {
		setSelectedSupplier(supplier);
		setEditProveedorShow(true);
	};

	const handleUpdateSupplier = async (updatedSupplier) => {
		try {
			await updateSupplier(updatedSupplier.supplierId, updatedSupplier);
			await loadSuppliers();
			setEditProveedorShow(false);
			setSelectedSupplier(null);
			toast.success("Proveedor actualizado correctamente");
		} catch (err) {
			console.error(err);
			toast.error("Error al actualizar el proveedor");
		}
	};

	// Assign provider logic based on role
	const assignProvider = async (providerId) => {
		try {
			// Department head assigns directly to their department
			if (user.roleName === "jefe_departamento") {
				const result = await assignProviderToDepartment({
					providerId,
					departmentId: user.departmentId,
				});

				if (result.error === "already_assigned") {
					toast.info(result.message);
				} else {
					toast.success("Proveedor asignado correctamente");
				}
				return;
			}

			// Admin opens department selection popup
			if (user.roleName === "admin") {
				setSelectedProviderId(providerId);
				setShowDepartmentPopup(true);
			}
		} catch (err) {
			console.error(err);
			toast.error("Error al asignar proveedor");
		}
	};

	// Handle assignment from popup
	const handleAssignToDepartment = async (departmentId) => {
		try {
			const result = await assignProviderToDepartment({
				providerId: selectedProviderId,
				departmentId,
			});

			if (result.error === "already_assigned") {
				toast.info(result.message);
			} else {
				toast.success("Proveedor asignado correctamente");
			}

			setShowDepartmentPopup(false);
			setSelectedProviderId(null);
		} catch (err) {
			console.error(err);
			toast.error("Error al asignar proveedor");
		}
	};

	return (
		<div className="page proveedores">
			<h1>Panel de Proveedores</h1>

			{/* Assign department popup */}
			{showDepartmentPopup && (
				<AssignDepartment
					isOpen={showDepartmentPopup}
					hidePopup={() => setShowDepartmentPopup(false)}
					departments={departments}
					onAssign={handleAssignToDepartment}
				/>
			)}

			{/* Edit supplier popup */}
			{editProveedorShow && selectedSupplier && (
				<EditSupplier
					hidePopup={() => {
						setEditProveedorShow(false);
						setSelectedSupplier(null);
					}}
					isOpen={editProveedorShow}
					proveedor={selectedSupplier}
					onUpdate={handleUpdateSupplier}
				/>
			)}

			{/* Create supplier popup */}
			{addProveedorShow && (
				<NewSupplier
					hidePopup={() => setAddProveedorShow(false)}
					isOpen={addProveedorShow}
					onCreate={handleCreateSupplier}
				/>
			)}

			{/* Top controls */}
			<div className="controlButtons">
				<div className="searchBar">
					<IoSearchOutline className="search-icon iconProveedores" />
					<input
						type="text"
						placeholder="Buscar por nombre"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				{canEdit && (
					<button
						className="addNewButton"
						onClick={() => setAddProveedorShow(true)}>
						<IoAddOutline className="iconProveedores" />
						Nuevo proveedor
					</button>
				)}
			</div>

			{/* Content */}
			{loading ? (
				<LoadingSpinner />
			) : filteredProveedores.length === 0 ? (
				<div className="mt-6 rounded-lg bg-secondary/60 p-6 text-center text-sm text-primary">
					No se encontraron proveedores
				</div>
			) : (
				<div className="hideHorizontalScroll">
					<table className="table">
						<thead>
							<tr>
								{COLUMN_HEADERS.map((header) => (
									<th key={header}>{header}</th>
								))}
								{canEdit && <th className="actionCell">Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{filteredProveedores.map((p) => (
								<ProveedorRow
									key={p.supplierId}
									proveedor={p}
									setProveedores={setProveedores}
									canEdit={canEdit}
									assignProvider={assignProvider}
									onEdit={openEditProveedor}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Proveedor;
