import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import AuthenticateLayout from "../../components/AuthenticateLayout/AuthenticateLayout";
import AuthInput from "../../components/AuthInput/AuthInput";
import Button from "../../components/Button/Button";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import {
  clearErrorMessage,
  handleLoginWithFirebase,
} from "../../redux/actions/auth";
import useForm from "../../utils/useForm";
import useValidator from "../../utils/useValidator";
import "./SignInPage.css";
const initialInputList = {
  email: {
    value: "",
    placeholder: "Email",
    name: "email",
    type: "email",
    isTouched: false,
    labelIcon: <i className="labelIcon far fa-envelope"></i>,
    validateIcon: <i className="validatedIcon fas fa-check"></i>,
    validators: [],
  },
  password: {
    value: "",
    placeholder: "Password",
    name: "password",
    type: "password",
    isTouched: false,
    labelIcon: <i className="labelIcon fas fa-lock"></i>,
    validateIcon: <i className="validatedIcon far fa-eye"></i>,
    validators: [],
  },
};

const SignInPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, error, isAuthenticating } = useSelector(
    (state) => state.auth
  );

  const {
    inputList,
    handleOnInputChange,
    handleSubmitCallback,
    handleSetTouchedInput,
  } = useForm(initialInputList, handleLogin);

  const { validateEmailFormat, validateEmptyField } = useValidator();
  const { validateAtLeastCharacterLength } = useValidator({ maxLength: 6 });
  const addValidatorsToInputList = () => {
    inputList.email.validators = [
      validateEmailFormat("Email is not valid"),
      validateEmptyField("Field must be not empty"),
    ];
    inputList.password.validators = [
      validateAtLeastCharacterLength("Field must be greater than 6")(6),
    ];
  };
  useEffect(() => {
    addValidatorsToInputList();
  }, []);
  useEffect(() => {
    if (error) {
      let i = setTimeout(() => {
        dispatch(clearErrorMessage());
        clearTimeout(i);
      }, 3000);
    }
  }, [error]);
  function handleLogin(user) {
    dispatch(handleLoginWithFirebase(user));
  }
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  const renderAuthInput = () => {
    const output = [];
    for (const input in inputList) {
      const html = (
        <AuthInput
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
    <AuthenticateLayout title="Welcome back">
      {isAuthenticating ? <LoadingIcon /> : ""}
      <p className="authError">{error ? error : " "}</p>
      <form onSubmit={handleSubmitCallback}>
        {renderAuthInput()}
        <div>
          <NavLink className="forgotLink" to="#">
            Forgot password ?
          </NavLink>
        </div>
        <div className="authButtonGroup">
          <Button isBlue>Login</Button>
          <div className="seperationButton">
            <span className="sepLine"></span>
            or
            <span className="sepLine"></span>
          </div>
          <NavLink to="/signup">
            <Button>Sign Up</Button>
          </NavLink>
        </div>
      </form>
    </AuthenticateLayout>
  );
};

export default SignInPage;
