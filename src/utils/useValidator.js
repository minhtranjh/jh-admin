import React from "react";
const useValidator = (customValue) => {
  const validateEmptyField = (input) => {
    if (input.value.length <= 0) {
      return `${input.label} must be not empty `;
    }
  };
  const validateEmailFormat = (input) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(input.value).toLowerCase())
      ? "Email is invalid"
      : "";
  };
  const validateAtLeastCharacterLength = (input) => {
    if (input.value.length < customValue.maxLength) {
      return `${input.label} must be greater than ${customValue.maxLength} `;
    }
  };
  const validateMatchedConfirmPassword = (input) => {
    if (customValue.password !== input.value) {
      return "Confirmed Password is not matched";
    }
  };
  const combineValidation = (validators) => (value) => {
    if (validators.length > 0 && value) {
      return validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );
    }
  };
  return {
    validateEmailFormat,
    validateEmptyField,
    validateAtLeastCharacterLength,
    validateMatchedConfirmPassword,
    combineValidation,
  };
};

export default useValidator;
