import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div
      className={`w-full shadow-xl overflow-hidden rounded-xl ${isOpen ? "open" : ""}`}
    >
      <div
        className={`flex items-center justify-between p-6 bg-secondary cursor-pointer ${isOpen ? "bg-accent" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-medium md:text-2xl">{title}</h2>
        <span>
          <MdKeyboardArrowDown
            className={`text-2xl transition-all duration-150 ease-in-out ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </div>
      <div
        className={`bg-background overflow-y-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
