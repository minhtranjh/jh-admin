import React from "react";
import "./Button.css"
function Button({type, children, isBlue ,onClick}) {
  return (
      <button type={type} onClick={onClick} className={`controlButton ${isBlue ? "bgBlue" : ""}`}>
        {children}
      </button>
  );
}

export default Button;
