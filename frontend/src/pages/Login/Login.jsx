import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { LuLock, LuUser } from "react-icons/lu";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", form.username);
      formData.append("password", form.password);

      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al iniciar sesión");
        return;
      }

      login(data);

      toast.success("Bienvenido!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-9">
      <div className="flex flex-col gap-7 text-center bg-background shadow-[0_20px_40px_rgba(37,35,35,0.08)] p-12 rounded-2xl max-w-md w-full">
        <div>
          <h1 className="font-medium text-text text-2xl mb-2 lg:text-3xl">
            Bienvenido
          </h1>
          <p className="text-primary text-sm">
            Gestiona tus finanzas con claridad.
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
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

          {/* Buttons */}
          <div className="mt-2 md:mt-6 flex flex-col gap-4">
            <button
              className="loginPageButton bg-accent hover:bg-[#8f7c66] hover:-translate-y-0.5"
              type="submit"
            >
              Iniciar Sesión
            </button>

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
