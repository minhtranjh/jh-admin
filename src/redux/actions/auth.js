import firebase from "../../firebase/firebaseConfig";
import { auth as authConstants } from "../contants/index";
// const firestore = firebase.firestore();
const auth = firebase.auth();
// const userRef = firestore.collection("users_tb");
// const memberRef = firestore.collection("members_tb");

// const getUserByField = async (field, value) => {
//   let user;
//   const userSnap = await userRef.where(field, "==", value).get();
//   userSnap.forEach((res) => {
//     if (res.exists) {
//       user = {
//         id: res.id,
//         ...res.data(),
//       };
//     }
//   });
//   return user;
// };
// const getMemberById = async (id) => {
//   const member = await memberRef.doc(id).get();
//   return {
//     id: member.id,
//     ...member.data(),
//   };
// };

const handleLoginWithFirebase = ({ email, password }) => {
  return async (dispatch) => {
    dispatch({
      type: `${authConstants.USER_LOGIN}_REQUEST`,
    });
    try {
      await auth.signInWithEmailAndPassword(email, password);
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
    } catch (error) {
      dispatch({
        type: `${authConstants.USER_LOGIN}_FAILED`,
        payload: {
          error: error.message,
        },
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
      const user = {
        displayName: currentUser.displayName,
        id: currentUser.uid,
        email: currentUser.email,
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      dispatch({
        type: `${authConstants.USER_SIGNUP}_SUCCESS`,
        payload: { user },
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
    const localUser = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser"))
      : null;
    if (!localUser) {
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
export {
  handleLoginWithFirebase,
  handleSignUpWithFirebase,
  logOutWithFirebase,
  checkIfUserLoggedIn,
};
