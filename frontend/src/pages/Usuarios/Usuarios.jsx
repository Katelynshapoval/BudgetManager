import { useEffect, useState } from "react";
import { RiEditLine } from "react-icons/ri";
import { fetchUsers } from "../../services/usersService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Formatters
  const formatRole = (role) => {
    const map = {
      admin: "Administrador",
      contable: "Contable",
      jefe_departamento: "Jefe de departamento",
    };
    return map[role] || role;
  };

  const formatStatus = (status) => {
    const map = {
      active: "Activo",
      pending: "Pendiente",
      inactive: "Inactivo",
    };
    return map[status] || status;
  };

  return (
    <div className="page">
      <h1>Usuarios</h1>

      <div className="hideHorizontalScroll">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th className="actionCell">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Cargando...</td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => {
                let statusClass = "bg-gray-100 text-gray-700 border-gray-300";

                if (u.status === "active") {
                  statusClass = "bg-green-100 text-green-700 border-green-300";
                } else if (u.status === "pending") {
                  statusClass =
                    "bg-yellow-100 text-yellow-700 border-yellow-300";
                } else if (u.status === "inactive") {
                  statusClass = "bg-red-100 text-red-700 border-red-300";
                }

                return (
                  <tr key={u.userId}>
                    <td>{u.name}</td>
                    <td>{u.username}</td>
                    <td>{formatRole(u.roleName)}</td>
                    <td>{u.departmentName ?? "-"}</td>

                    <td>
                      <span className={`viewInvoice ${statusClass}`}>
                        {formatStatus(u.status)}
                      </span>
                    </td>

                    <td className="actionCell">
                      <RiEditLine className="tableActionIcon" />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>No hay usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
