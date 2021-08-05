import firebase from "../../firebase/firebaseConfig";
import { position as positionContstants } from "../contants/index";
const firestore = firebase.firestore();
const positionTbRef = firestore.collection("positions_tb");

const onDispatchGetPositionListRequest = () => {
  return {
    type: `${positionContstants.GET_POSITION_LIST}_REQUEST`,
  };
};
const onDispatchGetPositionListSuccess = (payload) => {
  return {
    type: `${positionContstants.GET_POSITION_LIST}_SUCCESS`,
    payload: {
      ...payload,
    },
  };
};
const onDispatchGetPositionListFailed = (error) => {
  return {
    type: `${positionContstants.GET_POSITION_LIST}_FAILED`,
    payload: {
      error,
    },
  };
};
export const getPositionListFromFirebase = () => {
  return async (dispatch) => {
    dispatch(onDispatchGetPositionListRequest());
    try {
      const fetchAllUnsubscribe = positionTbRef.onSnapshot((snap) => {
        const positionList = [];
        snap.forEach((doc) => {
          if (!doc.data().name.toLowerCase().includes("operator")) {
            positionList.push({
              ...doc.data(),
              id: doc.id,
              createdAt: doc.data().createdAt.toDate().toDateString(),
            });
          }
        });
        dispatch(
          onDispatchGetPositionListSuccess({
            positionList,
            fetchAllUnsubscribe,
          })
        );
      });
    } catch (error) {
      dispatch(onDispatchGetPositionListFailed(error.message));
    }
  };
};
const onDispatchFilterListPositionSuccess = (filterObj) => {
  return {
    type: `${positionContstants.FILTER_POSITION}_SUCCESS`,
    payload: {
      filterObj,
    },
  };
};
export const filterListPosition = (filterObj) => {
  return async (dispatch) => {
    dispatch(onDispatchFilterListPositionSuccess(filterObj));
  };
};

const onDispatchGetPositionDetailsRequest = () => {
  return {
    type: `${positionContstants.GET_POSITION_DETAILS}_REQUEST`,
  };
};
const onDispatchGetPositionDetailsSuccess = (payload) => {
  return {
    type: `${positionContstants.GET_POSITION_DETAILS}_SUCCESS`,
    payload: { ...payload },
  };
};
const onDispatchGetPositionDetailsFailed = (error) => {
  return {
    type: `${positionContstants.GET_POSITION_DETAILS}_FAILED`,
    payload: { error },
  };
};
export const getPositionDetailsByIdFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchGetPositionDetailsRequest());
    try {
      const unsubscribeGetPositionDetails = positionTbRef
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const positionDetails = {
              ...doc.data(),
              id: doc.id,
              createdAt: doc.data().createdAt.toDate().toDateString(),
            };
            dispatch(
              onDispatchGetPositionDetailsSuccess({
                positionDetails,
                unsubscribeGetPositionDetails,
              })
            );
            return;
          }
          dispatch(onDispatchGetPositionDetailsFailed("Not found"));
        });
    } catch (error) {
      dispatch(onDispatchGetPositionDetailsFailed(error.message));
    }
  };
};
const onDispatchCreatePositionRequest = () => {
  return {
    type: `${positionContstants.CREATE_NEW_POSITION}_REQUEST`,
  };
};
const onDispatchCreatePositionSuccess = (payload) => {
  return {
    type: `${positionContstants.CREATE_NEW_POSITION}_SUCCESS`,
    payload: { ...payload },
  };
};
const onDispatchCreatePositionFailed = (error) => {
  return {
    type: `${positionContstants.CREATE_NEW_POSITION}_FAILED`,
    payload: {
      error,
    },
  };
};
export const createNewPositionToFirebase = (position) => {
  return async (dispatch) => {
    dispatch(onDispatchCreatePositionRequest());
    const unSubCreatePostion = positionTbRef
      .add({
        name: position.name,
        createdAt: new Date(),
      })
      .then((_) => {
        dispatch(
          onDispatchCreatePositionSuccess({
            unSubCreatePostion,
            message: "Create successfully",
          })
        );
      })
      .catch((error) => {
        dispatch(onDispatchCreatePositionFailed(error.message));
      });
  };
};
const onDispatchClearFilteredPositionListSuccess = () => {
  return {
    type: `${positionContstants.CLEAR_FILTERED_POSITION_LIST}_SUCCESS`,
  };
};
export const clearFilterPositionList = () => {
  return async (dispatch) => {
    dispatch(onDispatchClearFilteredPositionListSuccess());
  };
};
const onDispatchEditPositionDetailsRequest = () => {
  return {
    type: `${positionContstants.EDIT_POSITION_DETAILS}_REQUEST`,
  };
};
const onDispatchEditPositionDetailsSuccess = (payload) => {
  return {
    type: `${positionContstants.EDIT_POSITION_DETAILS}_SUCCESS`,
    payload: { ...payload },
  };
};
const onDispatchEditPositionDetailsFailed = (error) => {
  return {
    type: `${positionContstants.EDIT_POSITION_DETAILS}_FAILED`,
    payload: {
      error,
    },
  };
};
export const editPositionDetailsToFirebase = (position) => {
  return async (dispatch) => {
    dispatch(onDispatchEditPositionDetailsRequest());
    const unSubEditPostion = positionTbRef
      .doc(position.id)
      .update({
        name: position.name,
      })
      .then((_) => {
        dispatch(
          onDispatchEditPositionDetailsSuccess({
            unSubEditPostion,
            message: "Create successfully",
          })
        );
      })
      .catch((error) => {
        dispatch(onDispatchEditPositionDetailsFailed(error.message));
      });
  };
};
const onDispatchRemovePositionRequest = () => {
  return {
    type: `${positionContstants.DELETE_POSITION}_REQUEST`,
  };
};
const onDispatchRemovePositionSuccess = (payload) => {
  return {
    type: `${positionContstants.DELETE_POSITION}_SUCCESS`,
    payload: {
      ...payload,
    },
  };
};
const onDispatchRemovePositionFailed = (error)=>{
  return {
    type: `${positionContstants.DELETE_POSITION}_FAILED`,
    payload: {
      error,
    },
  }
}
export const removePositionFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchRemovePositionRequest());
    const unSubDeleteTeam = positionTbRef
      .doc(id)
      .delete()
      .then(() => {
        dispatch(
          onDispatchRemovePositionSuccess({
            message: "Delete successfully",
            unSubDeleteTeam,
          })
        );
      })
      .catch((error) => {
        dispatch(onDispatchRemovePositionFailed(error.message));
      });
  };
};
const onDispatchClearPositionErrorSuccess = ()=>{
  return {
    type: `${positionContstants.CLEAR_POSITION_ERROR_MESSAGE}_SUCCESS`,
  }
}
export const clearPositionErrorMessage = () => {
  return async (dispatch) => {
    dispatch(onDispatchClearPositionErrorSuccess());
  };
};
