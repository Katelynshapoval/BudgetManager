import { useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

function EditableCell({
  value,
  isEditing,
  editValue,
  setEditValue,
  onCancel,
  onKeyDown,
}) {
  const cellRef = useRef(null);

  // Cancel editing when clicking outside the cell
  useClickOutside(cellRef, isEditing, onCancel);

  return (
    <td ref={cellRef} className="relative">
      {/* Cell content */}
      <div className="relative">
        {/* Display value */}
        <div className={`tabular-nums ${isEditing ? "opacity-0" : ""}`}>
          {value}
        </div>

        {/* Edit input */}
        {isEditing && (
          <input
            type="number"
            max="9999999999"
            step="0.01"
            min="1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            className="absolute inset-0 w-full inlineEditInput reset-input"
          />
        )}
      </div>
    </td>
  );
}

export default EditableCell;
