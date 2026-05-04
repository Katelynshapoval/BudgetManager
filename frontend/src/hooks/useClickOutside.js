import { useEffect } from "react";

export function useClickOutside(ref, isActive, onClose) {
  useEffect(() => {
    if (!isActive) return;

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, isActive, onClose]);
}
