import firebase from "../../firebase/firebaseConfig";
import { user, user as userConstants } from "../contants/index";
const firestore = firebase.firestore();
const userTbRef = firestore.collection("users_tb");
const auth = firebase.auth();
const onDispatchRequestCreateUser = () => {
  return {
    type: `${userConstants.CREATE_NEW_USER}_REQUEST`,
  };
};
const onDispatchCreateUserSuccess = (payload) => {
  return {
    type: `${userConstants.CREATE_NEW_USER}_SUCCESS`,
    payload: { ...payload, message: "Create successfully" },
  };
};
const onDispatchCreateUserFailed = (error) => {
  return {
    type: `${userConstants.CREATE_NEW_USER}_FAILED`,
    payload: { error },
  };
};
export const createNewUserToFirebase = ({
  lastName,
  firstName,
  password,
  email,
  isActive,
}) => {
  return async (dispatch) => {
    dispatch(onDispatchRequestCreateUser());
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      const displayName = `${firstName} ${lastName}`;
      const currentUser = auth.currentUser;
      currentUser.updateProfile({
        displayName,
      });
      const unSubCreateUser = userTbRef.add({
        lastName,
        firstName,
        password,
        email,
        isActive,
        createdAt: new Date(),
      });
      dispatch(onDispatchCreateUserSuccess({ unSubCreateUser }));
    } catch (error) {
      dispatch(onDispatchCreateUserFailed(error.message));
    }
  };
};
const onDispatchRequestUserList = () => {
  return {
    type: `${userConstants.GET_USER_LIST}_REQUEST`,
  };
};
const onDispatchGetUserListSuccess = (payload) => {
  return {
    type: `${userConstants.GET_USER_LIST}_SUCCESS`,
    payload: { ...payload},
  };
};
const onDispatchGetUserListFailed = (error) => {
  return {
    type: `${userConstants.CREATE_NEW_USER}_FAILED`,
    payload: { error },
  };
};
export const getUserListFromFirebase = () => {
  return async (dispatch) => {
    dispatch(onDispatchRequestUserList());
    try {
      const unSubGetUserList = userTbRef.onSnapshot((snap) => {
        const userList = [];
        snap.forEach((doc) => {
          userList.push({
            ...doc.data(),
            id: doc.id,
            name: doc.data().lastName + " " + doc.data().firstName,
            createdAt: doc.data().createdAt.toDate().toDateString(),
          });
        });
        dispatch(onDispatchGetUserListSuccess({ userList, unSubGetUserList }));
      });
    } catch (error) {
      dispatch(onDispatchGetUserListFailed(error.message));
    }
  };
};
const onDispatchRequestActiveUser = () => {
  return {
    type: `${userConstants.ACTIVE_USER}_REQUEST`,
  };
};
const onDispatchActiveUserSuccess = (payload) => {
  return {
    type: `${userConstants.ACTIVE_USER}_SUCCESS`,
    payload: { ...payload, message: "Active user successfully" },
  };
};
const onDispatchActiveUserFailed = (error) => {
  return {
    type: `${userConstants.ACTIVE_USER}_FAILED`,
    payload: { error },
  };
};
export const activeUserToFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchRequestActiveUser());
    const unSubActiveUser = userTbRef
      .doc(id)
      .update({
        isActive: true,
      })
      .then(() => {
        dispatch(onDispatchActiveUserSuccess({ unSubActiveUser }));
      })
      .catch((error) => {
        dispatch(onDispatchActiveUserFailed(error.message));
      });
  };
};
const onDispatchRequestUnactiveUser = () => {
  return {
    type: `${userConstants.UNACTIVE_USER}_REQUEST`,
  };
};
const onDispatchUnactiveUserSuccess = (payload) => {
  return {
    type: `${userConstants.UNACTIVE_USER}_SUCCESS`,
    payload: { ...payload, message: "Unactive user successfully" },
  };
};
const onDispatchUnactiveUserFailed = (error) => {
  return {
    type: `${userConstants.UNACTIVE_USER}_FAILED`,
    payload: { error },
  };
};
export const unActiveUserToFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchRequestUnactiveUser());
    const unSubActiveUser = userTbRef
      .doc(id)
      .update({
        isActive: false,
      })
      .then(() => {
        dispatch(onDispatchUnactiveUserSuccess({ unSubActiveUser }));
      })
      .catch((error) => {
        dispatch(onDispatchUnactiveUserFailed(error.message));
      });
  };
};
const onDispatchRequestGetUserDetails = (id) => {
  return {
    type: `${userConstants.GET_USER_DETAILS}_REQUEST`,
    payload: { id },
  };
};
const onDispatchGetUserDetailsSuccess = (userDetails) => {
  return {
    type: `${userConstants.GET_USER_DETAILS}_SUCCESS`,
    payload: { userDetails },
  };
};
const onDispatchGetUserDetailsFail = (error) => {
  return {
    type: `${userConstants.GET_USER_DETAILS}_FAILED`,
    payload: { error },
  };
};
export const getUserDetailsFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchRequestGetUserDetails());
    try {
      userTbRef.doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          const userDetails = {
            ...doc.data(),
            id: doc.id,
          };
          dispatch(onDispatchGetUserDetailsSuccess(userDetails));
          return;
        }
        dispatch(onDispatchGetUserDetailsFail("Not found"));
      });
    } catch (error) {
      dispatch(onDispatchGetUserDetailsFail(error.message));
    }
  };
};
const onDispatchFilterUserListSuccess = (filterObj) => {
  return {
    type: `${userConstants.FILTER_USER}_SUCCESS`,
    payload: { filterObj },
  };
};
export const filterUserList = (filterObj) => {
  return async (dispatch) => {
    dispatch(onDispatchFilterUserListSuccess(filterObj));
  };
};
const onDispatchFilteredUserList = () => {
  return {
    type: `${userConstants.CLEAR_FILTERED_USER_LIST}_SUCCESS`,
  };
};
export const clearFilteredUserList = () => {
  return async (dispatch) => {
    dispatch(onDispatchFilteredUserList());
  };
};
const onDipatchRequestEditUser = () => {
  return {
    type: `${userConstants.EDIT_USER_DETAILS}_REQUEST`,
  };
};
const onDipatchEditUserSuccess = () => {
  return {
    type: `${userConstants.EDIT_USER_DETAILS}_SUCCESS`,
  };
};
const onDipatchEditUserFailed = () => {
  return {
    type: `${userConstants.EDIT_USER_DETAILS}_SUCCESS`,
  };
};

export const editUserDetailsToFirebase = (user) => {
  return async (dispatch) => {
    dispatch(onDipatchRequestEditUser());
    try {
      const unSubEditUser = userTbRef.doc(user.id).update({
        ...user,
      });
      dispatch(onDipatchEditUserSuccess({ unSubEditUser }));
    } catch (error) {
      dispatch(onDipatchEditUserFailed(error.message));
    }
  };
};
const onDispatchRequestRemoveUser = () => {
  return {
    type: `${userConstants.DELETE_USER}_REQUEST`,
  };
};
const onDispatchRemoveUserSuccess = () => {
  return {
    type: `${userConstants.DELETE_USER}_SUCCESS`,
  };
};
const onDispatchRemoveUserFailed = () => {
  return {
    type: `${userConstants.DELETE_USER}_FAILED`,
  };
};
export const removeUserFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchRequestRemoveUser());
    try {
      await userTbRef.doc(id).delete();
      dispatch(onDispatchRemoveUserSuccess());
    } catch (error) {
      dispatch(onDispatchRemoveUserFailed());
    }
  };
};

export const clearPositionErrorMessage = () => {
  return async (dispatch) => {
    dispatch({
      type: `${userConstants.CLEAR_USER_ERROR_MESSAGE}_SUCCESS`,
    });
  };
};
