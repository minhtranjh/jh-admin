import React from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

const Modal = ({ children, onClose,title }) => {
  const handleStopBubbling = (e) => {
    e.stopPropagation();
  };
  return createPortal(
    <div onClick={onClose} className="modalWrap">
      <div onClick={handleStopBubbling}  className="modalContent">
      <h2 className="modalTitle">{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById("modal_root")
  );
};

export default Modal;
