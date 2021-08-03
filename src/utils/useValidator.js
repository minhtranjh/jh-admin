const useValidator = () => {
  const validateEmptyField = (message) => (input) => {
    if (!input.value || input.value.length <= 0) {
      return message;
    }
  };
  const validateEmailFormat = (message) => (input) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(input.value).toLowerCase()) ? message : "";
  };
  const validateAtLeastCharacterLength =
    (message) => (maxLength) => (input) => {
      if (input.value.length < maxLength) {
        return message;
      }
    };
  const validateMatchedConfirmPassword =
    (message) => (password) => (input) => {
      if (password !== input.value) {
        return message;
      }
    };
  
  return {
    validateEmailFormat,
    validateEmptyField,
    validateAtLeastCharacterLength,
    validateMatchedConfirmPassword,
  };
};

export default useValidator;
