import { useState } from "react";
import Modal from "../../Modal/Modal";

function AssignDepartment({ isOpen, hidePopup, onAssign, departments = [] }) {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDepartment) return;

    onAssign(selectedDepartment);
  };

  return (
    <Modal
      title="Asignar a Departamento"
      onClose={hidePopup}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      submitLabel="Asignar"
    >
      <div className="popupInputContainer">
        <label htmlFor="departmentSelect">Departamento</label>
        <select
          id="departmentSelect"
          className="input"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
        >
          <option value="">Selecciona un departamento</option>

          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}

export default AssignDepartment;
