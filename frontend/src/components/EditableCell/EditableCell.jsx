import { useEffect, useRef } from "react";

function EditableCell({
  value,
  isEditing,
  editValue,
  setEditValue,
  onSave,
  onCancel,
  onKeyDown,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, onCancel]);

  return (
    <td ref={ref} className="relative">
      <div className="relative">
        <div className={`tabular-nums ${isEditing ? "opacity-0" : ""}`}>
          {value}
        </div>

        {isEditing && (
          <input
            type="number"
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
