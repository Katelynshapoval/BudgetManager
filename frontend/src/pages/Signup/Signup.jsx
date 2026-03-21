import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import "./Login.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const navigate = useNavigate();
  4;

  const handleCreateAccount = () => {
    // Login for creating acc
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
          <div className="inputContainer">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              className="text-sm md:text-base"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="usuario">Departamento</label>
            <input
              id="usuario"
              type="text"
              className="text-sm md:text-base"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className=" inputContainer">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className=" inputContainer">
            <label htmlFor="password">Confirmar contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-2 md:mt-6 flex flex-col gap-4">
            <button
              className="loginPageButton bg-accent hover:bg-[#8f7c66] hover:-translate-y-0.5"
              type="submit"
              id="signinButton"
            >
              Iniciar Sesión
            </button>
            <button
              className="loginPageButton bg-transparent text-primary hover:bg-accent/10 hover:text-accent border border-primary hover:border-accent"
              type="button"
              id="signupButton"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Signup;
