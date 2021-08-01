import React from "react";
import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";
import FormLoading from "../FormLoading/FormLoading";
import Modal from "../Modal/Modal";
import "./FormModal.css";
const FormModal = ({
  history,
  inputList,
  handleOnInputChange,
  title,
  handleSubmitForm,
  handleSetTouchedInput,
  isContentLoading,
  clearForm,
  combineValidation,
}) => {
  const renderInputList = () => {
    const output = [];
    for (let input in inputList) {
      const i = (
        <FormInput
          handleSetTouchedInput={handleSetTouchedInput}
          validate={combineValidation(inputList[input].validators)}
          key={inputList[input].name}
          optionLabel={inputList[input].optionLabel}
          options={inputList[input].options ? inputList[input].options : []}
          type={inputList[input].type}
          name={inputList[input].name}
          isTouched={inputList[input].isTouched}
          onChange={handleOnInputChange}
          value={inputList[input].value}
          placeholder={inputList[input].placeholder}
        />
      );
      output.push(i);
    }
    return output;
  };
  return (
    <>
      {history.location.search !== "?form=true" ? (
        ""
      ) : (
        <Modal
          title={title}
          onClose={() => {
            history.push({
              pathname: history.location.pathname,
              state : undefined,
            });
          }}
        >
          {!isContentLoading ? (
            <form onSubmit={handleSubmitForm}>
              {renderInputList()}
              <div className="modalBtnGroup">
                <Button type="submit" isBlue>
                  Submit
                </Button>
                <Button type="button" onClick={clearForm}>
                  Clear
                </Button>
              </div>
            </form>
          ) : (
            <FormLoading />
          )}
        </Modal>
      )}
    </>
  );
};

export default FormModal;
