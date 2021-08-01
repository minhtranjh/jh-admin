import { useState } from "react";

const useForm = (initialInputList, submitCallback) => {
  const [inputList, setInputList] = useState({...initialInputList});
  const handleOnInputChange = (e) => {
    let value = e.target.value;
    if (e.target.type === "file" && e.target.files.length > 0) {
      value = e.target.files[0];
    }
    setInputList((state) => ({
      ...state,
      [e.target.name]: { ...inputList[e.target.name], value: value },
    }));
  };
  const clearInputForm = () => {
    const newList = { ...inputList };
    for (const input in newList) {
      newList[input].value = "";
    }
    setInputList(newList);
  };
  const handleSubmitCallback = (e) => {
    e.preventDefault();
    submitCallback();
  };
 
  const handleSetTouchedInput = (e) => {
    const name = e.target.name;
    setInputList((state) => ({
      ...state,
      [name]: { ...inputList[name], isTouched: true },
    }));
  };
  return {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    clearInputForm,
    handleSetTouchedInput
  };
};

export default useForm;
