// Format a date with time
export const formatDateTime = (date) => {
  if (!date) {
    return "-";
  }

  // Return the date using Spanish format
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
