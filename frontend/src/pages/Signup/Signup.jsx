import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoPersonOutline,
  IoBusinessOutline,
  IoCardOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
} from "react-icons/io5";

import { toast } from "sonner";

import { signupRequest } from "../../services/authService";
import { fetchDepartments, fetchRoles } from "../../services/metaService";

import "./Signup.css";

// Role constants
const ROLES = {
  ADMIN: 1,
  DEPARTMENT_HEAD: 2,
  ACCOUNTANT: 3,
};

// Labels for roles
const ROLE_LABELS = {
  1: "Admin",
  2: "Jefe de departamento",
  3: "Contable",
};

function Signup() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    username: "",
    name: "",
    department: "",
    role: "",
    password: "",
    passwordConf: "",
  });

  // Metadata
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Load roles and departments on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [deps, rolesData] = await Promise.all([
          fetchDepartments(),
          fetchRoles(),
        ]);

        setDepartments(deps);
        setRoles(rolesData);
      } catch (err) {
        console.error(err);
        toast.error("Error cargando datos");
      }
    }

    loadData();
  }, []);

  // Handle form submission
  const handleCreateAccount = (e) => {
    e.preventDefault();

    // Validate passwords
    if (form.password !== form.passwordConf) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const request = signupRequest(form);

    // Show async feedback with toast
    toast.promise(request, {
      loading: "Creando cuenta...",
      success: () => {
        navigate("/login");
        return "Cuenta creada!";
      },
      error: (err) => err.message || "Error al crear la cuenta",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-9">
      <div className="flex flex-col gap-7 text-center bg-background shadow-[0_20px_40px_rgba(37,35,35,0.08)] p-12 rounded-2xl md:w-120">
        {/* Header */}
        <div>
          <h1 className="font-medium text-text text-2xl mb-2 lg:text-3xl">
            Crear la cuenta
          </h1>
          <p className="text-primary text-sm">
            Gestiona tus finanzas con claridad.
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleCreateAccount}>
          {/* Username */}
          <div className="inputContainer">
            <label htmlFor="username">Usuario</label>
            <div className="inputWithIcon">
              <IoPersonOutline className="inputIcon" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Ingresa tu usuario"
                className="inputField"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Name */}
          <div className="inputContainer">
            <label htmlFor="name">Nombre</label>
            <div className="inputWithIcon">
              <IoPersonOutline className="inputIcon" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ingresa tu nombre"
                className="inputField"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="inputContainer">
            <label htmlFor="role">Rol</label>
            <div className="inputWithIcon">
              <IoCardOutline className="inputIcon" />
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="inputField font-light"
                required
              >
                <option value="">Selecciona un rol</option>
                {roles.map((r) => (
                  <option key={r.roleId} value={r.roleId}>
                    {ROLE_LABELS[r.roleId]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department (only for department head) */}
          {Number(form.role) === ROLES.DEPARTMENT_HEAD && (
            <div className="inputContainer">
              <label htmlFor="department">Departamento</label>
              <div className="inputWithIcon">
                <IoBusinessOutline className="inputIcon" />
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="inputField font-light"
                  required
                >
                  <option value="">Selecciona un departamento</option>
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="inputContainer">
            <label htmlFor="password">Contraseña</label>
            <div className="inputWithIcon">
              <IoLockClosedOutline className="inputIcon" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                className="inputField"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Confirm password */}
          <div className="inputContainer">
            <label htmlFor="passwordConf">Confirmar contraseña</label>
            <div className="inputWithIcon">
              <IoShieldCheckmarkOutline className="inputIcon" />
              <input
                id="passwordConf"
                name="passwordConf"
                type="password"
                placeholder="Confirma tu contraseña"
                className="inputField"
                value={form.passwordConf}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-2 md:mt-6">
            <button
              className="loginPageButton bg-accent hover:bg-[#8f7c66]"
              type="submit"
            >
              Crear Cuenta
            </button>

            <div className="flex gap-1 justify-center mt-4 text-sm text-primary">
              ¿Ya tienes cuenta?
              <span
                onClick={() => navigate("/login")}
                className="text-accent cursor-pointer hover:underline"
              >
                Inicia sesión
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
