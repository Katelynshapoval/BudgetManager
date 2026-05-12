import { useEffect } from "react";

export function useClickOutside(ref, isActive, onClose) {
  // Listen for clicks outside when active
  useEffect(() => {
    if (!isActive) return;

    // Close when clicking outside the referenced element
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, isActive, onClose]);
}
