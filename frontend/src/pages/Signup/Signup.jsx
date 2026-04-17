import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LuUser } from "react-icons/lu";
import { LuBuilding2 } from "react-icons/lu";
import { LuIdCard } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { LuLock } from "react-icons/lu";

import { toast } from "sonner";

import { signupRequest } from "../../services/authService";
import { fetchDepartments, fetchRoles } from "../../services/metaService";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    department: "",
    role: "",
    password: "",
    passwordConf: "",
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const roleLabels = {
    1: "Admin",
    2: "Jefe de departamento",
    3: "Contable",
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch departments
  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await fetchDepartments();
        setDepartments(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadDepartments();
  }, []);

  // Fetch roles
  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (err) {
        console.error(err);
        setRoles([]);
      }
    }

    loadRoles();
  }, []);

  // Submit handler
  const handleCreateAccount = (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConf) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const request = signupRequest(form);

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
              <LuUser className="inputIcon" />

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
            <label htmlFor="username">Nombre</label>
            <div className="inputWithIcon">
              <LuUser className="inputIcon" />

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
              <LuIdCard className="inputIcon" />
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
                    {roleLabels[r.roleId]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {roleLabels[form.role] == "Jefe de departamento" && (
            <div className="inputContainer">
              <label htmlFor="department">Departamento</label>
              <div className="inputWithIcon">
                <LuBuilding2 className="inputIcon" />
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="font-light inputField"
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
              <LuLock className="inputIcon" />

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

          {/* Confirm Password */}
          <div className="inputContainer">
            <label htmlFor="passwordConf">Confirmar contraseña</label>
            <div className="inputWithIcon">
              <LuShieldCheck className="inputIcon" />
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
            <div className="mt-4 text-sm text-primary">
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
