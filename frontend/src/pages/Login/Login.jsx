import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline, IoLockClosedOutline } from "react-icons/io5";

import { AuthContext } from "../../context/AuthContext";
import { loginRequest } from "../../services/authService";
import { toast } from "sonner";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase() : value,
    }));
  };

  // Handle login submit
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const username = form.username.trim().toLowerCase();

      const data = await loginRequest(username, form.password);

      // Save user in context
      login(data);

      toast.success("Bienvenido!");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-9">
      <div className="flex flex-col gap-7 text-center bg-background shadow-[0_20px_40px_rgba(37,35,35,0.08)] p-12 rounded-2xl max-w-md w-full">
        {/* Header */}
        <div>
          <h1 className="font-medium text-text text-2xl mb-2 lg:text-3xl">
            Bienvenido
          </h1>
          <p className="text-primary text-sm">
            Gestiona tus finanzas con claridad.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
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
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
              />

            </div>
          </div>

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

          {/* Actions */}
          <div className="mt-2 md:mt-6 flex flex-col gap-4">
            {/* Login button */}
            <button
              className="loginPageButton bg-accent hover:bg-[#8f7c66] hover:-translate-y-0.5"
              type="submit"
            >
              Iniciar Sesión
            </button>

            {/* Signup redirect */}
            <button
              className="loginPageButton bg-transparent text-primary hover:bg-accent/10 hover:text-accent border border-primary hover:border-accent"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
