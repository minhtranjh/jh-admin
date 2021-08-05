import React from "react";
import { useParams } from "react-router-dom";
import useQuery from "../../utils/useQuery";
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
  error,
  isModalOpen,
  ...agg
}) => {
  const query = useQuery()
  const renderInputList = () => {
    const output = [];
    for (let input in inputList) {
      const i = (
        <FormInput
          handleSetTouchedInput={handleSetTouchedInput}
          error={inputList[input].error}
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
      {!isModalOpen ? (
        ""
      ) : (
        <Modal
          title={title}
          onClose={() => {
            const query = new URLSearchParams(history.location.search);
            query.delete("id");
            query.delete("form");
            history.push({
              pathname: history.location.pathname,
              search: query.toString(),
            });
          }}
        >
          {!isContentLoading ? (
            <form onSubmit={handleSubmitForm}>
              {renderInputList()}
              {error && error.type === "confirm" ? (
                <div className="teamUpdateConfirm">
                  <p>{error.text}</p>
                  <div className="teamUpdateBtn">
                    <Button
                      onClick={() => {
                        history.push({
                          pathname: history.location.pathname,
                          search: `form=true&id=${agg.teamByLeader.id}`,
                        });
                      }}
                      isBlue
                    >
                      Continue
                    </Button>
                    <Button>Discard</Button>
                  </div>
                </div>
              ) : (
                ""
              )}
              {error?.type !== "confirm" && (
                <div className="modalBtnGroup">
                  <Button type="submit" isBlue>
                    Submit
                  </Button>
                  <Button type="button" onClick={clearForm}>
                    Clear
                  </Button>
                </div>
              )}
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
