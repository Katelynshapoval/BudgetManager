import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";

import NuevoProveedor from "../../components/Popups/NuevoProveedor/NuevoProveedor";

const COLUMN_HEADERS = [
	"Nombre",
	"Email",
	"Teléfono",
	"Identificación fiscal",
	"Notas",
];

const TOTAL_COLUMNS = COLUMN_HEADERS.length + 1; // +1 for "Acciones"

// Delete Supplier
const deleteSupplier = async (id, setProveedores) => {
	if (!window.confirm("¿Estás seguro de borrar este proveedor?")) return;

	try {
		console.log("Enviando DELETE para ID:", id);
		const response = await fetch(
			`http://localhost:8080/api/suppliers?id=${id}`,
			{
				method: "DELETE",
			},
		);
		console.log(
			"Respuesta del servidor:",
			response.status,
			response.statusText,
		);

		if (response.ok) {
			console.log("Eliminación exitosa en backend, actualizando frontend");
			// Filtramos por el ID correcto
			setProveedores((prev) => prev.filter((p) => p.supplierId !== id));
		} else {
			let errorMsg = "Error al eliminar en el servidor";
			try {
				const errorData = await response.json();
				errorMsg = errorData.error || errorMsg;
			} catch (e) {
				console.error("Error parseando respuesta:", e);
			}
			console.error("Error en backend:", response.status, errorMsg);
			alert(errorMsg);
		}
	} catch (error) {
		console.error("Error de red:", error);
		alert("Error de conexión al servidor");
	}
};

function ProveedorRow({ proveedor, setProveedores }) {
	return (
		<tr>
			<td>{proveedor.name}</td>
			<td>{proveedor.email}</td>
			<td>{proveedor.phone}</td>
			<td>{proveedor.taxId}</td>
			<td>{proveedor.notes}</td>
			<td className="actionCell">
				<RiEditLine className="tableActionIcon" />
				<MdDeleteOutline
					className="tableActionIcon"
					// Usamos supplierId (minúscula la 'd')
					onClick={() => deleteSupplier(proveedor.supplierId, setProveedores)}
				/>
			</td>
		</tr>
	);
}

function EmptyRow() {
	return (
		<tr>
			<td colSpan={TOTAL_COLUMNS} className="text-center text-primary">
				No se encontraron proveedores
			</td>
		</tr>
	);
}

// Main component

function Proveedor() {
	const [addProveedorShow, setAddProveedorShow] = useState(false);
	const [proveedores, setProveedores] = useState([]);
	const [search, setSearch] = useState("");

	const filteredProveedores = proveedores.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()),
	);

	useEffect(() => {
		fetch("http://localhost:8080/api/suppliers")
			.then((res) => res.json())
			.then((data) => {
				setProveedores(data);
			})
			.catch((err) => console.error("Error fetching suppliers:", err));
	}, []);

	return (
		<div className="page proveedores">
			<h1>Panel de Proveedores</h1>

			{addProveedorShow && (
				<NuevoProveedor
					hidePopup={() => setAddProveedorShow(false)}
					isOpen={addProveedorShow}
				/>
			)}

			{/* Toolbar */}
			<div className="controlButtons">
				<div className="searchBar">
					<CiSearch className="search-icon iconProveedores" />
					<input
						type="text"
						placeholder="Buscar por nombre"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<button
					className="addNewButton"
					onClick={() => setAddProveedorShow(true)}>
					<IoAddOutline className="iconProveedores" />
					Nuevo proveedor
				</button>
			</div>

			{/* Table */}
			<div className="hideHorizontalScroll">
				<table className="table">
					<thead>
						<tr>
							{COLUMN_HEADERS.map((header) => (
								<th key={header}>{header}</th>
							))}
							<th className="actionCell">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{filteredProveedores.length > 0 ? (
							filteredProveedores.map((p) => (
								<ProveedorRow
									key={p.supplierId}
									proveedor={p}
									setProveedores={setProveedores}
								/>
							))
						) : (
							<EmptyRow />
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Proveedor;
