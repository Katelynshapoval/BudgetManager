export async function getSuppliers({ departmentId, all } = {}) {
	let url = "/api/suppliers";

	const params = new URLSearchParams();

	if (departmentId) params.append("departmentId", departmentId);
	if (all) params.append("all", "true");

	if (params.toString()) {
		url += `?${params.toString()}`;
	}

	const res = await fetch(url, {
		credentials: "include",
	});

	if (!res.ok) throw new Error("Failed to fetch suppliers");
	return res.json();
}

export async function createSupplier({
	name,
	email,
	phone,
	taxId,
	notes,
	shared,
}) {
	const res = await fetch("/api/suppliers", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			email,
			phone,
			taxId,
			notes,
			shared,
		}),
	});

	if (!res.ok) {
		throw new Error("Failed to create supplier");
	}

	return res.json();
}

export async function updateSupplier(
	supplierId,
	{ name, email, phone, taxId, notes },
) {
	const url = `/api/suppliers?id=${supplierId}`;
	const res = await fetch(url, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			email,
			phone,
			taxId,
			notes,
		}),
	});

	if (!res.ok) {
		throw new Error("Failed to update supplier");
	}

	return res.json();
}

export async function assignProviderToDepartment({ providerId, departmentId }) {
	const res = await fetch("/api/suppliers/assign", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			providerId,
			departmentId: Number(departmentId),
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		if (res.status === 409) {
			return { error: "already_assigned", message: data.error };
		}
		throw new Error("Failed to assign provider to department");
	}

	return data;
}
