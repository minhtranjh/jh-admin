import React from "react";
import "./Button.css";
function Button({ type, children, isBlue, onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`controlButton ${disabled ? "disabledBtn" : ""} ${
        isBlue ? "bgBlue" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;
