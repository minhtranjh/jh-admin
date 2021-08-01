import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import AuthenticateLayout from "../../components/AuthenticateLayout/AuthenticateLayout";
import AuthInput from "../../components/AuthInput/AuthInput";
import Button from "../../components/Button/Button";
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";
import { handleLoginWithFirebase } from "../../redux/actions/auth";
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
  const { isAuthenticated, isAuthenticating } = useSelector(
    (state) => state.auth
  );

  const {
    inputList: { email, password },
    handleOnInputChange,
    handleSubmitCallback,
    handleSetTouchedInput,
  } = useForm(initialInputList, handleLogin);

  const { validateEmailFormat, validateEmptyField,combineValidation } = useValidator();
  const { validateAtLeastCharacterLength } = useValidator({ maxLength: 6 });

    email.validators = [validateEmailFormat, validateEmptyField];
    password.validators = [validateAtLeastCharacterLength];

  function handleLogin() {
    const user = {
      email: email.value,
      password: password.value,
    };
    dispatch(handleLoginWithFirebase(user));
  }
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <AuthenticateLayout title="Welcome back">
      {isAuthenticating ? <LoadingIcon /> : ""}
      <form onSubmit={handleSubmitCallback}>
        <AuthInput
          validate={combineValidation(email.validators)}
          name={email.name}
          handleSetTouchedInput={handleSetTouchedInput}
          handleOnInputChange={handleOnInputChange}
          value={email.value}
          isTouched={email.isTouched}
          type={email.type}
          placeholder={email.placeholder}
          labelIcon={email.labelIcon}
          validateIcon={email.validateIcon}
        />
        <AuthInput
          validate={combineValidation(password.validators)}
          name={password.name}
          handleSetTouchedInput={handleSetTouchedInput}
          isTouched={password.isTouched}
          handleOnInputChange={handleOnInputChange}
          value={password.value}
          type={password.type}
          placeholder={password.placeholder}
          labelIcon={password.labelIcon}
          validateIcon={password.validateIcon}
        />
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
