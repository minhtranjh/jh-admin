import React from "react";
import "./AuthInput.css";
function AuthInput({
  validate,
  labelIcon,
  value,
  handleOnInputChange,
  name,
  validateIcon,
  placeholder,
  type,
  isTouched,
  handleSetTouchedInput
}) {
  return (
    <div className="inputGroup">
      <div className="inputIcon">{labelIcon}</div>
      <input
      onBlur={handleSetTouchedInput}
        placeholder={placeholder}
        autoComplete="off"
        onChange={handleOnInputChange}
        value={value}
        name={name}
        type={type}
      />
      {validateIcon}
      <p className="inputError">{isTouched&&validate({ value, label: placeholder })}</p>
      <div className="inputLine"></div>
    </div>
  );
}

export default AuthInput;
