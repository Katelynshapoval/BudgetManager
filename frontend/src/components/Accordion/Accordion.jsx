import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Toggle accordion content
  const handleToggle = () => {
    setIsOpen((currentState) => !currentState);
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-xl shadow-xl ${
        isOpen ? "open" : ""
      }`}
    >
      {/* Accordion header */}
      <div
        className={`flex cursor-pointer items-center justify-between bg-secondary p-6 ${
          isOpen ? "bg-accent" : ""
        }`}
        onClick={handleToggle}
      >
        {/* Header title */}
        <h2 className="text-lg font-medium md:text-2xl">{title}</h2>

        {/* Toggle icon */}
        <span>
          <MdKeyboardArrowDown
            className={`text-2xl transition-all duration-150 ease-in-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </div>

      {/* Accordion content */}
      <div
        className={`overflow-y-hidden bg-background transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
