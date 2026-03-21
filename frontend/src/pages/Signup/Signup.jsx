import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    department: "",
    role: "",
    password: "",
    passwordConf: "",
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

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
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
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
      formData.append("password", form.password);
      formData.append("passwordConf", form.passwordConf);
      formData.append("departmentId", form.department);
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
      <div className="flex flex-col gap-7 text-center bg-background shadow-[0_20px_40px_rgba(37,35,35,0.08)] p-12 rounded-2xl max-w-md w-full">
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
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Ingresa tu usuario"
              className="text-sm md:text-base"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Department */}
          <div className="inputContainer">
            <label htmlFor="department">Departamento</label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full text-sm md:text-base font-normal rounded-lg border border-primary bg-secondary px-3 py-2 md:py-3.5"
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

          {/* Role */}
          <div className="inputContainer">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full text-sm md:text-base font-normal rounded-lg border border-primary bg-secondary px-3 py-2 md:py-3.5"
              required
            >
              <option value="">Selecciona un rol</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="inputContainer">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="text-sm md:text-base"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="inputContainer">
            <label htmlFor="passwordConf">Confirmar contraseña</label>
            <input
              id="passwordConf"
              name="passwordConf"
              type="password"
              placeholder="Confirma tu contraseña"
              className="text-sm md:text-base"
              value={form.passwordConf}
              onChange={handleChange}
              required
            />
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
              ¿Ya tienes cuenta?{" "}
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
