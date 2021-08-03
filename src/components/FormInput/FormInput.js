import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./FormInput.css";

const FormInput = ({
  type,
  placeholder,
  value = "",
  name,
  onChange,
  optionLabel,
  options,
  isTouched,
  error,
  handleSetTouchedInput,
}) => {
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  
  const inputMap = {
    text: {
      render: () => (
        <div className="formInputGroup">
          <p className="formInputError">
            {isTouched && error}
          </p>
          <input
            onBlur={handleSetTouchedInput}
            autoComplete={"off"}
            className="formInput"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      ),
    },
    password: {
      render: () => (
        <div className="formInputGroup">
          <p className="formInputError">
            {isTouched && error}
          </p>
          <input
            onBlur={handleSetTouchedInput}
            autoComplete={"off"}
            className="formInput"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      ),
    },
    checkbox: {
      render: () => (
        <div className="formInput radio">
          <input
            onBlur={handleSetTouchedInput}
            onChange={onChange}
            id={`htmlCheckboxInput`}
            name={name}
            value={value}
            checked={value}
            type="checkbox"
          />
          <label htmlFor={`htmlCheckboxInput`}>{placeholder}</label>
        </div>
      ),
    },
    email: {
      render: () => (
        <div className="formInputGroup">
          <p className="formInputError">
            {isTouched && error}
          </p>
          <input
            onBlur={handleSetTouchedInput}
            autoComplete={"off"}
            className="formInput"
            type="text"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      ),
    },
    date: {
      render: () => (
        <div className="inputDate formInputGroup">
          <p className="formInputError">
            {isTouched && error}
          </p>

          <input
            onBlur={handleSetTouchedInput}
            autoComplete={"off"}
            className="formInput date"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      ),
    },
    file: {
      render: () => {
        return (
          <div className="inputFileGroup">
            <img className="inputImage" ref={imageRef} alt={`form avatar`} />
            <input
              onBlur={handleSetTouchedInput}
              autoComplete={"off"}
              className="formInput inputFile"
              type={type}
              value={""}
              ref={inputRef}
              name={name}
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>
        );
      },
    },
    select: {
      render: () => {
        return (
          <div className="formInputGroup">
            <p className="formInputError">
              {isTouched && error}
            </p>
            <select
              name={name}
              value={value}
              onChange={onChange}
              onBlur={handleSetTouchedInput}
              className="formInput"
            >
              <option value="">{placeholder}</option>
              {options.map((op) => (
                <option key={op.id} value={op.id}>
                  {op[optionLabel]}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    textarea: {
      render: () => (
        <div className="formInputGroup">
          <p className="formInputError">
            {isTouched && error}
          </p>
          <textarea
            onChange={onChange}
            name={name}
            value={value}
            onBlur={handleSetTouchedInput}
            className="formInput"
            placeholder={placeholder}
          ></textarea>
        </div>
      ),
    },
    radio: {
      render: () => (
        <div className="radioInputGroup formInputGroup">
          <p className="formInputError">
            {isTouched && error}
          </p>
          {options.map((op) => {
            return (
              <div key={op[optionLabel]} className="formInput radio">
                <input
                  onBlur={handleSetTouchedInput}
                  onChange={onChange}
                  id={`html${op[optionLabel]}`}
                  name={name}
                  value={op[optionLabel]}
                  type="radio"
                  checked={value === op[optionLabel]}
                />
                <label htmlFor={`html${op[optionLabel]}`}>
                  {op[optionLabel]}
                </label>
              </div>
            );
          })}
        </div>
      ),
    },
  };
  useEffect(() => {
    const setImage = () => {
      if (inputRef.current && inputRef.current.files.length > 0) {
        imageRef.current.src = URL.createObjectURL(inputRef.current.files[0]);
      }
    };
    if (type === "file" && inputRef.current) {
      inputRef.current.addEventListener("change", setImage);
    }
    return () => {
      setImage();
    };
  }, [type]);

  useEffect(() => {
    const showImageFromInputFile = () => {
      if (type === "file") {
        if (value === "") {
          imageRef.current.style.display = "none";
          return (imageRef.current.src = "");
        }

        if (value) {
          imageRef.current.style.display = "initial";
          if (typeof value === "string") {
            return (imageRef.current.src = value);
          }
          return (imageRef.current.src = URL.createObjectURL(value));
        }
      }
    };
    showImageFromInputFile();
  }, [value, type]);
  return <>{inputMap[type].render()}</>;
};

export default FormInput;
