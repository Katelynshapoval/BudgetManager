import { useEffect } from "react";

export function useClickOutside(ref, isActive, onClose) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (isActive && ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, isActive, onClose]);
}
