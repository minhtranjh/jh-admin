import firebase from "../../firebase/firebaseConfig";
import { team as teamConstants } from "../contants/index";
const firestore = firebase.firestore();
const teamTbRef = firestore.collection("teams_tb");
const membersTbRef = firestore.collection("members_tb");
const getLeaderById = async (id) => {
  const leader = await membersTbRef.doc(id).get();
  return leader.exists
    ? {
        ...leader.data(),
        name: leader.data().lastName + " " + leader.data().firstName,
        id: leader.id,
      }
    : undefined;
};
const isDoneLoopingSnapShot = (index, size) => {
  return index === size;
};
const onDispatchGetTeamListRequest = () => {
  return {
    type: `${teamConstants.GET_TEAM_LIST}_REQUEST`,
  };
};
const onDispatchGetTeamListSuccess = (payload) => {
  return {
    type: `${teamConstants.GET_TEAM_LIST}_SUCCESS`,
    payload: {
      ...payload,
    },
  };
};
const onDispatchGetTeamListFailed = (error) => {
  return {
    type: `${teamConstants.GET_TEAM_LIST}_FAILED`,
    payload: {
      error: error,
    },
  };
};
export const getTeamListFromFirebase = () => {
  return async (dispatch) => {
    dispatch(onDispatchGetTeamListRequest());
    try {
      const fetchAllUnsubscribe = teamTbRef.onSnapshot((snap) => {
        const teamList = [];
        let index = 0;
        snap.forEach(async (doc) => {
          const leader = await getLeaderById(doc.data().leaderId);
          teamList.push({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toDateString(),
            leader: leader ? leader.name : "NULL", 
          });
          index++;
          if (isDoneLoopingSnapShot(index, snap.size)) {
            dispatch(
              onDispatchGetTeamListSuccess({ teamList, fetchAllUnsubscribe })
            );
          }
        });
      });
    } catch (error) {
      dispatch(onDispatchGetTeamListFailed(error.message));
    }
  };
};

const onDispatchGetTeamDetailsRequest = () => {
  return {
    type: `${teamConstants.GET_TEAM_DETAILS}_REQUEST`,
  };
};
const onDispatchGetTeamDetailSuccess = (payload) => {
  return {
    type: `${teamConstants.GET_TEAM_DETAILS}_SUCCESS`,
    payload: { ...payload },
  };
};
const onDispatchGetTeamDetailsFailed = (error) => {
  return {
    type: `${teamConstants.GET_TEAM_DETAILS}_FAILED`,
    payload: { error },
  };
};
export const getTeamDetailsByIdFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchGetTeamDetailsRequest());
    try {
      const unSubGetTeamDetails = teamTbRef.doc(id).onSnapshot(async (doc) => {
        if (doc.exists) {
          const leader = await getLeaderById(doc.data().leaderId);
          const teamDetails = {
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toDateString(),
            leader: leader ? leader.id : "NULL",
          };
          dispatch(
            onDispatchGetTeamDetailSuccess({ teamDetails, unSubGetTeamDetails })
          );
          return;
        }
        dispatch(onDispatchGetTeamDetailsFailed("404"));
      });
    } catch (error) {
      dispatch(onDispatchGetTeamDetailsFailed(error.message));
    }
  };
};
const onDispatchFilterTeamList = (filterObj) => {
  return {
    type: `${teamConstants.FILTER_TEAM}_SUCCESS`,
    payload: {
      filterObj,
    },
  };
};
export const filterTeamList = (filterObj) => {
  return async (dispatch) => {
    dispatch(onDispatchFilterTeamList(filterObj));
  };
};
const onDispatchClearFilteredTeamList = () => {
  return {
    type: `${teamConstants.CLEAR_FILTERED_TEAM_LIST}_SUCCESS`,
  };
};
export const clearFilteredTeamList = () => {
  return async (dispatch) => {
    dispatch(onDispatchClearFilteredTeamList());
  };
};
const onDispatchCreateTeamRequest = () => {
  return {
    type: `${teamConstants.CREATE_NEW_TEAM}_REQUEST`,
  };
};
const onDispatchCreateTeamSuccess = (payload) => {
  return {
    type: `${teamConstants.CREATE_NEW_TEAM}_SUCCESS`,
    payload: { ...payload },
  };
};
const onDispatchCreateTeamFailed = (error) => {
  return {
    type: `${teamConstants.CREATE_NEW_TEAM}_FAILED`,
    payload: {
      error,
    },
  };
};
export const createNewTeamToFirebase = (team) => {
  return async (dispatch) => {
    dispatch(onDispatchCreateTeamRequest());
    const unSubCreateTeam = teamTbRef
      .add({
        name: team.name,
        leaderId: team.leader,
        createdAt: new Date(),
      })
      .then((_) => {
        dispatch(
          onDispatchCreateTeamSuccess({
            unSubCreateTeam,
            message: "Create successfully",
          })
        );
      })
      .catch((error) => {
        dispatch(onDispatchCreateTeamFailed());
      });
  };
};

const onDispatchEditTeamFailed = (payload) => {
  return {
    type: `${teamConstants.EDIT_TEAM_DETAILS}_FAILED`,
    payload: {
      ...payload,
    },
  };
};
const getTeamByLeaderFromFirebase = async (leaderId) => {
  let team;
  const snap = await teamTbRef.where("leaderId", "==", leaderId).get();
  snap.forEach((doc) => {
    team = { ...doc.data(), id: doc.id };
  });
  return team;
};
const onDispatchEditTeamDetailRequest = () => {
  return {
    type: `${teamConstants.EDIT_TEAM_DETAILS}_REQUEST`,
  };
};
const onDispatchEditTeamDetailSuccess = (payload) => {
  return {
    type: `${teamConstants.EDIT_TEAM_DETAILS}_SUCCESS`,
    payload: { ...payload },
  };
};
export const editTeamDetailsToFirebase = (team) => {
  return async (dispatch) => {
    dispatch(onDispatchEditTeamDetailRequest());
    const teamOfNewLeader = await getTeamByLeaderFromFirebase(team.leader);
    if (teamOfNewLeader && teamOfNewLeader.id === team.id) {
      const unSubEditTeam = teamTbRef
        .doc(team.id)
        .update({
          ...team,
        })
        .then((_) => {
          return dispatch(
            onDispatchEditTeamDetailSuccess({
              unSubEditTeam,
              message: "Edit successfully",
            })
          );
        });
    }
    if (teamOfNewLeader) {
      const newLeader = (await membersTbRef.doc(team.leader).get()).data();
      return dispatch(
        onDispatchEditTeamFailed({
          teamByLeader: teamOfNewLeader,
          error: {
            type: "confirm",
            text: `${
              newLeader.lastName + " " + newLeader.firstName
            } is managing ${
              teamOfNewLeader.name
            } team. You need to set new leader to ${teamOfNewLeader.name} team`,
          },
        })
      );
    }
    const teamIdOfNewLeader = await (
      await membersTbRef.doc(team.leader).get()
    ).data.teamId;
    const oldLeaderId = (await teamTbRef.doc(team.id).get()).data().leaderId;
    const teamIdOfOldLeader = (await membersTbRef.doc(oldLeaderId).get()).data() ? (await membersTbRef.doc(oldLeaderId).get()).data().teamId : undefined
    if (teamIdOfOldLeader !== teamIdOfNewLeader) {
      membersTbRef.doc(team.leader).update({
        teamId: teamIdOfOldLeader,
      });
    }
    const unSubEditTeam = teamTbRef
      .doc(team.id)
      .update({
        leaderId: team.leader,
        name: team.name,
      })
      .then((_) => {
        dispatch(
          onDispatchEditTeamDetailSuccess({
            unSubEditTeam,
            message: "Edit successfully",
            teamByLeader: {},
          })
        );
      })
      .catch((error) => {
        dispatch(onDispatchEditTeamFailed(error.message));
      });
  };
};
const onDispatchRemoveTeamRequest = () => {
  return {
    type: `${teamConstants.DELETE_TEAM}_REQUEST`,
  };
};
const onDispatchRemoveTeamSuccess = (payload) => {
  return {
    type: `${teamConstants.DELETE_TEAM}_SUCCESS`,
    payload: {
      ...payload,
    },
  };
};
const onDispatchRemoveTeamFailed = (error) => {
  return {
    type: `${teamConstants.DELETE_TEAM}_FAILED`,
    payload: {
      error,
    },
  };
};
export const removeTeamFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch(onDispatchRemoveTeamRequest());
    const unSubDeleteTeam = teamTbRef
      .doc(id)
      .delete()
      .then(() => {
        dispatch(
          onDispatchRemoveTeamSuccess({
            message: "Delete successfully",
            unSubDeleteTeam,
          })
        );
      })
      .catch((error) => {
        dispatch(onDispatchRemoveTeamFailed(error.message));
      });
  };
};
const onDispatchClearTeamErrorSuccess = () => {
  return {
    type: `${teamConstants.CLEAR_TEAM_ERROR_MESSAGE}_SUCCESS`,
  };
};
export const clearTeamErrorMessage = () => {
  return async (dispatch) => {
    dispatch(onDispatchClearTeamErrorSuccess());
  };
};
