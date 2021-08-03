import { useRef } from "react";
import { useState } from "react";
import useValidator from "./useValidator";

const useForm = (initialInputList, submitCallback) => {
  const [inputList, setInputList] = useState({ ...initialInputList });
  const combineValidation = (validators) => (value) => {
    if (validators && validators.length > 0 && value) {
      return validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );
    }
  };
  const handleOnInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (e.target.id === "htmlCheckboxInput") {
      value = e.target.value === "false" ? true : false;
    }
    if (e.target.type === "file" && e.target.files.length > 0) {
      value = e.target.files[0];
    }
    const error = combineValidation(inputList[name].validators)({
      value: value,
      label: inputList[name].placeholder,
    });
    setInputList((state) => ({
      ...state,
      [name]: { ...inputList[name], value: value, error },
    }));
  };

  const clearInputForm = () => {
    const newList = { ...inputList };
    for (const input in newList) {
      newList[input].value = "";
      newList[input].isTouched = false;
    }
    setInputList(newList);
  };
  const handleSubmitCallback = (e) => {
    e.preventDefault();
    let inputValue = {};
    const newInputList = { ...inputList };
    let inputValidCount = 0;
    let length = 0;
    for (const input in newInputList) {
      length++;
      inputValue[input] = newInputList[input].value;
      if (!newInputList[input].isTouched && !newInputList[input].value) {
        const error = combineValidation(newInputList[input].validators)({
          value: newInputList[input].value,
          label: newInputList[input].placeholder,
        });
        newInputList[input].error = error;
        newInputList[input].isTouched = true
      }
      if (!newInputList[input].error) {
        inputValidCount++;
      }
    }
    console.log(newInputList);
    if (length === inputValidCount) {
      submitCallback(inputValue);
    } else {
      setInputList(newInputList);
    }
  };
  const setValueToInputValue = (valueObj) => {
    const newInputList = { ...inputList };
    for (const input in inputList) {
      newInputList[input].value = valueObj[input];
      newInputList[input].error = undefined;
      newInputList[input].isTouched = false;
    }
    setInputList(newInputList);
  };
  const handleSetTouchedInput = (e) => {
    const name = e.target.name;
    const error = combineValidation(inputList[name].validators)({
      value: inputList[name].value,
      label: inputList[name].placeholder,
    });
    setInputList((state) => ({
      ...state,
      [name]: { ...inputList[name], isTouched: true, error },
    }));
  };
  return {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    setValueToInputValue,
    clearInputForm,
    handleSetTouchedInput,
  };
};

export default useForm;
