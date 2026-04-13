import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LuUser } from "react-icons/lu";
import { LuBuilding2 } from "react-icons/lu";
import { LuIdCard } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { LuLock } from "react-icons/lu";

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
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/roles");
        const data = await res.json();
        setRoles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  // Submit handler
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConf) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Prepare data for backend
      const formData = new URLSearchParams();
      formData.append("username", form.username);
      formData.append("name", form.name);
      formData.append("password", form.password);
      formData.append("passwordConf", form.passwordConf);
      if (form.department) {
        formData.append("departmentId", form.department);
      }
      formData.append("roleId", form.role);

      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Cuenta creada exitosamente!");
        navigate("/login");
      } else {
        alert(data.error || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error de conexión con el servidor");
    }
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
