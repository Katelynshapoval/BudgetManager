import { useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";

import Modal from "../../Modal/Modal";

// Generate a random strong password
function generateStrongPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  let password = "";

  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

function ChangePassword({ isOpen, hidePopup, onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // Validate and submit password
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      setError("Completa todos los campos");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    onSubmit(password);
  };

  // Generate and set a new password
  const handleGenerate = () => {
    const newPassword = generateStrongPassword();

    setPassword(newPassword);
    setError("");
  };

  return (
    <Modal
      title="Cambiar contraseña"
      onClose={hidePopup}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      {/* Password field */}
      <div className="popupInputContainer">
        <label>Nueva contraseña</label>

        <div className="relative">
          <input
            type="text"
            className="input w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={handleGenerate}
            title="Generar contraseña"
            className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 p-1.5 text-primary transition-colors hover:text-accent"
          >
            <IoRefreshOutline className="text-xl" />
          </button>
        </div>
      </div>

      {/* Confirm password field */}
      <div className="popupInputContainer">
        <label>Confirmar contraseña</label>

        <input
          type="text"
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </Modal>
  );
}

export default ChangePassword;
