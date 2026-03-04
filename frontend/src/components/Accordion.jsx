import "../css/components/Accordion.css";

import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`accordion ${isOpen ? "open" : ""}`}>
      <div className="accordionHeader" onClick={() => setIsOpen(!isOpen)}>
        <h2>{title}</h2>
        <span>
          <MdKeyboardArrowDown className="iconAccordion" />
        </span>
      </div>
      <div className="accordionContent">{children}</div>
    </div>
  );
}

export default Accordion;
