import firebase from "../../firebase/firebaseConfig";
import { auth as authConstants } from "../contants/index";
const firestore = firebase.firestore();
const auth = firebase.auth();
const userRef = firestore.collection("users_tb");
// const memberRef = firestore.collection("members_tb");

const getUserByField = async (field, value) => {
  let user;
  const userSnap = await userRef.where(field, "==", value).get();
  userSnap.forEach((res) => {
    if (res.exists) {
      user = {
        id: res.id,
        ...res.data(),
      };
    }
  });
  return user;
};
const onDispatchLoginRequest = () => {
  return {
    type: `${authConstants.USER_LOGIN}_REQUEST`,
  };
};
const onDispatchLoginSuccess = (user) => {
  return {
    type: `${authConstants.USER_LOGIN}_SUCCESS`,
    payload: { user, message: "Login successfully" },
  };
};
const onDispatchLoginFailed = (error) => {
  return {
    type: `${authConstants.USER_LOGIN}_FAILED`,
    payload: {
      error: error,
    },
  };
};
const handleLoginWithFirebase = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(onDispatchLoginRequest());
    const user = await getUserByField("email", email);
    if (user) {
      if (user.isActive) {
        auth
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            const currentUser = auth.currentUser;
            const user = {
              displayName: currentUser.displayName,
              id: currentUser.uid,
              email: currentUser.email,
            };
            localStorage.setItem("currentUser", JSON.stringify(user));
            dispatch(onDispatchLoginSuccess(user));
            return;
          })
          .catch((error) => {
            dispatch(onDispatchLoginFailed(error.message));
            return;
          });
      } else {
        dispatch(
          onDispatchLoginFailed("User does not have permission to log in")
        );
        return;
      }
    } else {
      dispatch(onDispatchLoginFailed("User doesn't exists"));
    }
  };
};
const onDispatchSignUpRequest = () => {
  return {
    type: `${authConstants.USER_SIGNUP}_REQUEST`,
  };
};
const onDispatchSignUpSuccess = (payload) => {
  return {
    type: `${authConstants.USER_SIGNUP}_SUCCESS`,
    payload: { ...payload },
  };
};
const onDisptachSignUpFailed = (error) => {
  return {
    type: `${authConstants.USER_SIGNUP}_FAILED`,
    payload: {
      error: error,
    },
  };
};
const handleSignUpWithFirebase = ({ email, password, firstName, lastName }) => {
  return async (dispatch) => {
    dispatch(onDispatchSignUpRequest());
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      const displayName = `${firstName} ${lastName}`;
      const currentUser = auth.currentUser;
      currentUser.updateProfile({
        displayName,
      });
      const unSubSignUp = userRef.add({
        lastName,
        firstName,
        password,
        email,
        isActive: false,
        createdAt: new Date(),
      });
      dispatch(
        onDispatchSignUpSuccess({
          unSubSignUp,
          message: "Sign up successfully",
        })
      );
    } catch (error) {
      dispatch(onDisptachSignUpFailed(error.message));
    }
  };
};
const onDispatchLogoutRequest = () => {
  return {
    type: `${authConstants.USER_LOGOUT}_REQUEST`,
  };
};
const onDispatchLogoutSuccess = () => {
  return {
    type: `${authConstants.USER_LOGOUT}_SUCCESS`,
    payload: {
      message: "Logout successfully",
    },
  };
};
const onDispatchLogoutFailed = (error) => {
  return {
    type: `${authConstants.USER_LOGOUT}_FAILED`,
    payload: {
      error: error,
    },
  };
};
const logOutWithFirebase = () => {
  return async (dispatch) => {
    dispatch(onDispatchLogoutRequest());
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("currentUser");
        dispatch(onDispatchLogoutSuccess());
      })
      .catch((error) => {
        dispatch(onDispatchLogoutFailed(error.message));
      });
  };
};
const onDispatchCheckUserLoggedInFailed = (error) => {
  return {
    type: `${authConstants.USER_LOGIN}_FAILED`,
    payload: {
      error,
    },
  };
};
const onDispatchCheckUserLoggedInSuccess = (user) => {
  return {
    type: `${authConstants.USER_LOGIN}_SUCCESS`,
    payload: {
      user,
    },
  };
};
const checkIfUserLoggedIn = () => {
  return async (dispatch) => {
    const currentUser = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser"))
      : null;
    if (!currentUser) {
      localStorage.removeItem("currentUser");
      return dispatch(onDispatchCheckUserLoggedInFailed(""));
    }
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const user = {
          displayName: currentUser.displayName,
          id: currentUser.uid,
          email: currentUser.email,
        };
        return dispatch(onDispatchCheckUserLoggedInSuccess(user));
      }
      return dispatch(onDispatchCheckUserLoggedInFailed("Login again"));
    });
  };
};
const onDispatchClearErrorSuccess = () => {
  return {
    type: `${authConstants.CLEAR_ERROR_MESSAGE}_SUCCESS`,
  };
};
const clearErrorMessage = () => {
  return async (dispatch) => {
    dispatch(onDispatchClearErrorSuccess());
  };
};
export {
  clearErrorMessage,
  handleLoginWithFirebase,
  handleSignUpWithFirebase,
  logOutWithFirebase,
  checkIfUserLoggedIn,
};
