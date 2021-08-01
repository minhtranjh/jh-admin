import firebase from "../../firebase/firebaseConfig";
import { position as positionContstants } from "../contants/index";
const firestore = firebase.firestore();
const positionTbRef = firestore.collection("positions_tb");

export const getPositionListFromFirebase = () => {
  return async (dispatch) => {
    dispatch({
      type: `${positionContstants.GET_POSITION_LIST}_REQUEST`,
    });
    try {
      const fetchAllUnsubscribe = positionTbRef.onSnapshot((snap) => {
        const positionList = [];
        snap.forEach((doc) => {
          positionList.push({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toDateString(),
          });
        });
        dispatch({
          type: `${positionContstants.GET_POSITION_LIST}_SUCCESS`,
          payload: {
            positionList,
            fetchAllUnsubscribe,
          },
        });
      });
    } catch (error) {
      dispatch({
        type: `${positionContstants.GET_POSITION_LIST}_FAILED`,
        payload: {
          error,
        },
      });
    }
  };
};

export const getPositionDetailsByIdFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${positionContstants.GET_POSITION_DETAILS}_REQUEST`,
    });
    try {
      const unsubscribeGetPositionDetails = positionTbRef
        .doc(id)
        .onSnapshot((doc) => {
          const positionDetails = {
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toDateString(),
          };
          dispatch({
            type: `${positionContstants.GET_POSITION_DETAILS}_SUCCESS`,
            payload: { positionDetails, unsubscribeGetPositionDetails },
          });
        });
    } catch (error) {
      dispatch({
        type: `${positionContstants.GET_POSITION_DETAILS}_FAILED`,
        payload: {
          error,
        },
      });
    }
  };
};
export const createNewPositionToFirebase = (position) => {
  return async (dispatch) => {
    dispatch({
      type: `${positionContstants.CREATE_NEW_POSITION}_REQUEST`,
    });
    const unSubCreatePostion = positionTbRef
      .add({
        name: position.name.value,
        createdAt: new Date(),
      })
      .then((_) => {
        dispatch({
          type: `${positionContstants.CREATE_NEW_POSITION}_SUCCESS`,
          payload: { unSubCreatePostion, message: "Create successfully" },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${positionContstants.CREATE_NEW_POSITION}_FAILED`,
          payload: {
            error,
          },
        });
      });
  };
};
export const editPositionDetailsToFirebase = (position) => {
  return async (dispatch) => {
    dispatch({
      type: `${positionContstants.EDIT_POSITION_DETAILS}_REQUEST`,
    });
    const unSubEditPostion = positionTbRef
      .doc(position.id)
      .update({
        name: position.name.value,
      })
      .then((_) => {
        dispatch({
          type: `${positionContstants.EDIT_POSITION_DETAILS}_SUCCESS`,
          payload: { unSubEditPostion, message: "Create successfully" },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${positionContstants.EDIT_POSITION_DETAILS}_FAILED`,
          payload: {
            error,
          },
        });
      });
  };
};
export const removePositionFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${positionContstants.DELETE_POSITION}_REQUEST`,
    });
    const unSubDeleteTeam = positionTbRef
      .doc(id)
      .delete()
      .then(() => {
        dispatch({
          type: `${positionContstants.DELETE_POSITION}_SUCCESS`,
          payload: {
            message: "Delete successfully",
            unSubDeleteTeam,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${positionContstants.DELETE_POSITION}_FAILED`,
          payload: {
            message: error.message,
          },
        });
      });
  };
};
