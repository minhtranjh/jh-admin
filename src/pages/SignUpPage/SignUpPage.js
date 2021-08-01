import React from "react";
import AuthenticateLayout from "../../components/AuthenticateLayout/AuthenticateLayout";
import useForm from "../../utils/useForm";
import AuthInput from "../../components/AuthInput/AuthInput";
import Button from "../../components/Button/Button";
import { NavLink, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSignUpWithFirebase } from "../../redux/actions/auth";
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
  confirmPassword: {
    value: "",
    placeholder: "Confirm password",
    name: "confirmPassword",
    type: "password",
    isTouched: false,
    labelIcon: <i className="far fa-check-circle"></i>,
    validateIcon: <i className="validatedIcon far fa-eye"></i>,
  },
  password: {
    value: "",
    placeholder: "Password",
    name: "password",
    type: "password",
    labelIcon: <i className="labelIcon fas fa-lock"></i>,
    validateIcon: <i className="validatedIcon far fa-eye"></i>,
  },
};
function SignOutPage() {
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthenticating } = useSelector(
    (state) => state.auth
  );
  const {
    inputList: { email, firstName, lastName, confirmPassword, password },
    handleOnInputChange,
    handleSubmitCallback,
    handleSetTouchedInput,
  } = useForm(initialInputList, handleSignUp);

  const { validateMatchedConfirmPassword } = useValidator({
    password: password.value,
  });
  const { validateAtLeastCharacterLength } = useValidator({ maxLength: 6 });

  const { validateEmptyField, validateEmailFormat, combineValidation } =
    useValidator();

  useEffect(() => {
    const addValidatorToInputList = () => {
      firstName.validators = [validateEmptyField];
      lastName.validators = [validateEmptyField];
      email.validators = [validateEmailFormat, validateEmptyField];
      password.validators = [validateAtLeastCharacterLength];
    };
    addValidatorToInputList();
  }, []);

  useEffect(() => {
    const addValidatorDepenedsOnValueToInputList = () => {
      confirmPassword.validators = [
        validateEmptyField,
        validateMatchedConfirmPassword,
      ];
    };
    addValidatorDepenedsOnValueToInputList()
  }, [password.value]);

  function handleSignUp() {
    const user = {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
    };
    dispatch(handleSignUpWithFirebase(user));
  }
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <AuthenticateLayout title="Create a account">
      {isAuthenticating ? <LoadingIcon /> : ""}
      <form onSubmit={handleSubmitCallback}>
        <AuthInput
          validate={combineValidation(firstName.validators)}
          isTouched={firstName.isTouched}
          handleSetTouchedInput={handleSetTouchedInput}
          name={firstName.name}
          handleOnInputChange={handleOnInputChange}
          value={firstName.value}
          type={firstName.type}
          placeholder={firstName.placeholder}
          labelIcon={firstName.labelIcon}
          validateIcon={firstName.validateIcon}
        />
        <AuthInput
          validate={combineValidation(lastName.validators)}
          isTouched={lastName.isTouched}
          handleSetTouchedInput={handleSetTouchedInput}
          name={lastName.name}
          handleOnInputChange={handleOnInputChange}
          value={lastName.value}
          type={lastName.type}
          placeholder={lastName.placeholder}
          labelIcon={lastName.labelIcon}
          validateIcon={lastName.validateIcon}
        />
        <AuthInput
          validate={combineValidation(email.validators)}
          isTouched={email.isTouched}
          handleSetTouchedInput={handleSetTouchedInput}
          name={email.name}
          handleOnInputChange={handleOnInputChange}
          value={email.value}
          type={email.type}
          placeholder={email.placeholder}
          labelIcon={email.labelIcon}
          validateIcon={email.validateIcon}
        />
        <AuthInput
          validate={combineValidation(password.validators)}
          isTouched={password.isTouched}
          handleSetTouchedInput={handleSetTouchedInput}
          name={password.name}
          handleOnInputChange={handleOnInputChange}
          value={password.value}
          type={password.type}
          placeholder={password.placeholder}
          labelIcon={password.labelIcon}
          validateIcon={password.validateIcon}
        />
        <AuthInput
          validate={combineValidation(confirmPassword.validators)}
          isTouched={confirmPassword.isTouched}
          handleSetTouchedInput={handleSetTouchedInput}
          name={confirmPassword.name}
          handleOnInputChange={handleOnInputChange}
          value={confirmPassword.value}
          type={confirmPassword.type}
          placeholder={confirmPassword.placeholder}
          labelIcon={confirmPassword.labelIcon}
          validateIcon={confirmPassword.validateIcon}
        />

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
