import React from "react";
import AuthenticateLayout from "../../components/AuthenticateLayout/AuthenticateLayout";
import useForm from "../../utils/useForm";
import AuthInput from "../../components/AuthInput/AuthInput";
import Button from "../../components/Button/Button";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrorMessage,
  handleSignUpWithFirebase,
} from "../../redux/actions/auth";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import useValidator from "../../utils/useValidator";
import { useEffect } from "react";
const initialInputList = {
  firstName: {
    value: "",
    placeholder: "First Name",
    name: "firstName",
    type: "text",
    labelIcon: <i className="labelIcon fas fa-file-signature"></i>,
    validateIcon: <i className="validatedIcon fas fa-check"></i>,
  },
  lastName: {
    value: "",
    placeholder: "Last Name",
    name: "lastName",
    type: "text",
    labelIcon: <i className="far fa-user"></i>,
    validateIcon: <i className="validatedIcon fas fa-check"></i>,
  },
  email: {
    value: "",
    placeholder: "Email",
    name: "email",
    type: "email",
    labelIcon: <i className="labelIcon far fa-envelope"></i>,
    validateIcon: <i className="validatedIcon fas fa-check"></i>,
  },

  password: {
    value: "",
    placeholder: "Password",
    name: "password",
    type: "password",
    labelIcon: <i className="labelIcon fas fa-lock"></i>,
    validateIcon: <i className="validatedIcon far fa-eye"></i>,
  },
  confirmPassword: {
    value: "",
    placeholder: "Confirm password",
    name: "confirmPassword",
    type: "password",
    isTouched: false,
    labelIcon: <i className="far fa-check-circle"></i>,
    validateIcon: <i className="validatedIcon far fa-eye"></i>,
  },
};
function SignOutPage() {
  const dispatch = useDispatch();
  const { isSigningUp, isSignUpSuccess, error, message } = useSelector(
    (state) => state.auth
  );
  const history = useHistory();
  const {
    inputList,
    handleOnInputChange,
    handleSubmitCallback,
    handleSetTouchedInput,
  } = useForm(initialInputList, handleSignUp);

  const {
    validateAtLeastCharacterLength,
    validateMatchedConfirmPassword,
    validateEmptyField,
    validateEmailFormat,
  } = useValidator();

  useEffect(() => {
    inputList.firstName.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.lastName.validators = [
      validateEmptyField("Field must be not empty"),
    ];
    inputList.email.validators = [
      validateEmailFormat("Email is not valid"),
      validateEmptyField("Field must be not empty"),
    ];
    inputList.password.validators = [
      validateEmptyField("Field must be not empty"),
      validateAtLeastCharacterLength("Field must more than 6 letters")(6),
    ];
  }, []);
  useEffect(() => {
    inputList.confirmPassword.validators = [
      validateEmptyField("Field must be not empty"),
      validateMatchedConfirmPassword("Confirmed password is not matched")(
        inputList.password.value
      ),
    ];
  }, [inputList.password.value]);
  useEffect(() => {
    if (error) {
      let i = setTimeout(() => {
        dispatch(clearErrorMessage());
        clearTimeout(i);
      }, 3000);
    }
  }, [error]);
  useEffect(() => {
    if (isSigningUp) {
      let i = setTimeout(() => {
        history.push("/login");
        clearTimeout(i);
      }, 3000);
    }
  }, [isSigningUp]);
  function handleSignUp(user) {
    dispatch(handleSignUpWithFirebase(user));
  }

  const renderAuthInput = () => {
    const output = [];
    for (const input in inputList) {
      const html = (
        <AuthInput
          key={inputList[input].name}
          error={inputList[input].error}
          isTouched={inputList[input].isTouched}
          handleSetTouchedInput={handleSetTouchedInput}
          name={inputList[input].name}
          handleOnInputChange={handleOnInputChange}
          value={inputList[input].value}
          type={inputList[input].type}
          placeholder={inputList[input].placeholder}
          labelIcon={inputList[input].labelIcon}
          validateIcon={inputList[input].validateIcon}
        />
      );
      output.push(html);
    }
    return output;
  };
  return (
    <AuthenticateLayout title="Create a account">
      {isSigningUp ? <LoadingIcon /> : ""}
      <form onSubmit={handleSubmitCallback}>
        <p className="authError">{error ? error : " "}</p>
        <p className="authMessage">{message ? message : " "}</p>

        {renderAuthInput()}
        <div className="authButtonGroup">
          <Button isGreen={true}>Sign Up</Button>
          <div className="seperationButton">
            <span className="sepLine"></span>
            or
            <span className="sepLine"></span>
          </div>
          <NavLink to="/login">
            <Button>Login</Button>
          </NavLink>
        </div>
      </form>
    </AuthenticateLayout>
  );
}

export default SignOutPage;
