import { useState } from "react";

import Modal from "../../Modal/Modal";

function AssignDepartment({ isOpen, hidePopup, onAssign, departments = [] }) {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Assign selected department
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
      {/* Department field */}
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

          {departments.map((department) => (
            <option
              key={department.departmentId}
              value={department.departmentId}
            >
              {department.name}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}

export default AssignDepartment;
