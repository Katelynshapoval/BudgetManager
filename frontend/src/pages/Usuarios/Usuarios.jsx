import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import {
  fetchUsers,
  updateUserStatus,
  updateUserPassword,
} from "../../services/usersService";
import ChangePassword from "../../components/Popups/ChangePassword/ChangePassword";
import { toast } from "sonner";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Action handlers

  const handleApprove = async (userId) => {
    try {
      await updateUserStatus({ userId, status: "active" });
      toast.success("Usuario aprobado");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar usuario");
    }
  };

  const handleReject = async (userId) => {
    try {
      await updateUserStatus({ userId, status: "inactive" });
      toast.success("Usuario rechazado");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Error al rechazar usuario");
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await updateUserStatus({ userId, status: "inactive" });
      toast.success("Usuario desactivado");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Error al desactivar usuario");
    }
  };

  const handleActivate = async (userId) => {
    try {
      await updateUserStatus({ userId, status: "active" });
      toast.success("Usuario activado");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Error al activar usuario");
    }
  };

  const handleResetPassword = (userId) => {
    setSelectedUserId(userId);
    setShowPasswordPopup(true);
  };

  const handleSubmitPassword = async (newPassword) => {
    try {
      await updateUserPassword({
        userId: selectedUserId,
        newPassword,
      });

      toast.success("Contraseña actualizada");
      setShowPasswordPopup(false);
      setSelectedUserId(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar contraseña");
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

      {showPasswordPopup && (
        <ChangePassword
          hidePopup={() => {
            setShowPasswordPopup(false);
            setSelectedUserId(null);
          }}
          isOpen={showPasswordPopup}
          onSubmit={handleSubmitPassword}
        />
      )}

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
                      {u.status === "pending" && (
                        <>
                          <IoCheckmarkCircleOutline
                            className="tableActionIcon text-green-600"
                            title="Aprobar"
                            onClick={() => handleApprove(u.userId)}
                          />
                          <IoCloseCircleOutline
                            className="tableActionIcon text-red-600"
                            title="Rechazar"
                            onClick={() => handleReject(u.userId)}
                          />
                        </>
                      )}

                      {u.status === "active" && (
                        <>
                          <IoCloseCircleOutline
                            className="tableActionIcon text-red-600"
                            title="Desactivar"
                            onClick={() => handleDeactivate(u.userId)}
                          />
                          <IoLockClosedOutline
                            className="tableActionIcon text-gray-600"
                            title="Resetear contraseña"
                            onClick={() => handleResetPassword(u.userId)}
                          />
                        </>
                      )}

                      {u.status === "inactive" && (
                        <IoCheckmarkCircleOutline
                          className="tableActionIcon text-green-600"
                          title="Reactivar"
                          onClick={() => handleActivate(u.userId)}
                        />
                      )}
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
