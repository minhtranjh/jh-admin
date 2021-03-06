import { auth as authConstants } from "../contants/index";

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  isAuthenticating: false,
  isSigningUp: false,
  isSignUpSuccess : false,
  isAuthenticated: false,
  isLogggingout: false,
  message: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `${authConstants.USER_LOGIN}_REQUEST`:
      state = {
        ...state,
        isAuthenticating: true,
      };
      return state;
    case `${authConstants.USER_LOGIN}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        error: "",
        isAuthenticating: false,
      };
      return state;
    case `${authConstants.USER_LOGIN}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isAuthenticated: false,
        isAuthenticating: false,
      };
      return state;
    case `${authConstants.USER_SIGNUP}_REQUEST`:
      state = {
        ...state,
        isSigningUp: true,
        isSignUpSuccess:false,
      };
      return state;
    case `${authConstants.USER_SIGNUP}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error: "",
        isSignUpSuccess:true,
        isSigningUp: false,
      };
      return state;
    case `${authConstants.USER_SIGNUP}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        message: "",
        isSignUpSuccess:false,

        isSigningUp: false,
      };
      return state;
    case `${authConstants.USER_LOGOUT}_REQUEST`:
      state = {
        ...state,
        isLogggingout: true,
      };
      return state;

    case `${authConstants.USER_LOGOUT}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isLogggingout: false,
        error: "",

        isAuthenticated: false,
      };
      return state;
    case `${authConstants.USER_LOGOUT}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isLogggingout: false,
      };
      return state;
    case `${authConstants.CLEAR_ERROR_MESSAGE}_SUCCESS`:
      state = {
        ...state,
        error: "",
      };
      return state;
    default:
      return state;
  }
};
