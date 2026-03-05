import "./Login.css";

function Login() {
  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="info">
          <h1>Bienvenido</h1>
          <p>Gestiona tus finanzas con claridad.</p>
        </div>
        <form action="#">
          <div className="username inputContainer">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              className="input"
              required
            />
          </div>
          <div className="password inputContainer">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <div className="buttons">
            <button type="submit" id="signinButton">
              Iniciar Sesión
            </button>
            <button type="button" id="signupButton">
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
