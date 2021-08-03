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
const handleLoginWithFirebase = ({ email, password }) => {
  return async (dispatch) => {
    dispatch({
      type: `${authConstants.USER_LOGIN}_REQUEST`,
    });
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
            dispatch({
              type: `${authConstants.USER_LOGIN}_SUCCESS`,
              payload: { user, message: "Login successfully" },
            });
            return;
          })
          .catch((error) => {
            dispatch({
              type: `${authConstants.USER_LOGIN}_FAILED`,
              payload: {
                error: error.message,
              },
            });
            return;
          });
      } else {
        dispatch({
          type: `${authConstants.USER_LOGIN}_FAILED`,
          payload: { error: "User has no permission to login" },
        });
        return;
      }
    } else {
      dispatch({
        type: `${authConstants.USER_LOGIN}_FAILED`,
        payload: { error: "User doesn't exists" },
      });
    }
  };
};
const handleSignUpWithFirebase = ({ email, password, firstName, lastName }) => {
  return async (dispatch) => {
    dispatch({
      type: `${authConstants.USER_SIGNUP}_REQUEST`,
    });
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
      dispatch({
        type: `${authConstants.USER_SIGNUP}_SUCCESS`,
        payload: { unSubSignUp,  message : "Sign up successfully"},
      });
    } catch (error) {
      dispatch({
        type: `${authConstants.USER_SIGNUP}_FAILED`,
        payload: {
          error: error.message,
        },
      });
    }
  };
};
const logOutWithFirebase = () => {
  return async (dispatch) => {
    dispatch({
      type: `${authConstants.USER_LOGOUT}_REQUEST`,
    });
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("currentUser");
        dispatch({
          type: `${authConstants.USER_LOGOUT}_SUCCESS`,
          payload: {
            message: "Logout successfully",
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${authConstants.USER_LOGOUT}_FAILED`,
          payload: {
            error: error.message,
          },
        });
      });
  };
};
const checkIfUserLoggedIn = () => {
  return async (dispatch) => {
    const currentUser = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser"))
      : null;
    if (!currentUser) {
      localStorage.removeItem("currentUser");
      return dispatch({
        type: `${authConstants.USER_LOGIN}_FAILED`,
        payload: {
          error: "",
        },
      });
    }
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        return dispatch({
          type: `${authConstants.USER_LOGIN}_SUCCESS`,
          payload: {
            user: {
              displayName: currentUser.displayName,
              id: currentUser.uid,
              email: currentUser.email,
            },
          },
        });
      }
      return dispatch({
        type: `${authConstants.USER_LOGIN}_FAILED`,
        payload: {
          error: "Login again",
        },
      });
    });
  };
};
const clearErrorMessage = () => {
  return async (dispatch) => {
    dispatch({
      type: `${authConstants.CLEAR_ERROR_MESSAGE}_SUCCESS`,
    });
  };
};
export {
  clearErrorMessage,
  handleLoginWithFirebase,
  handleSignUpWithFirebase,
  logOutWithFirebase,
  checkIfUserLoggedIn,
};
