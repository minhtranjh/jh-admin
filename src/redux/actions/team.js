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
export const getTeamListFromFirebase = () => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.GET_TEAM_LIST}_REQUEST`,
    });
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
            leader: leader.name,
          });
          index++;
          if (isDoneLoopingSnapShot(index, snap.size)) {
            dispatch({
              type: `${teamConstants.GET_TEAM_LIST}_SUCCESS`,
              payload: {
                teamList,
                fetchAllUnsubscribe,
              },
            });
          }
        });
      });
    } catch (error) {
      dispatch({
        type: `${teamConstants.GET_TEAM_LIST}_FAILED`,
        payload: {
          error: error,
        },
      });
    }
  };
};

export const getTeamDetailsByIdFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.GET_TEAM_DETAILS}_REQUEST`,
    });
    try {
      const unSubGetTeamDetails = teamTbRef.doc(id).onSnapshot(async (doc) => {
        if (doc.exists) {
          const leader = await getLeaderById(doc.data().leaderId);
          const teamDetails = {
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toDateString(),
            leader: leader.id,
          };
          dispatch({
            type: `${teamConstants.GET_TEAM_DETAILS}_SUCCESS`,
            payload: { teamDetails, unSubGetTeamDetails },
          });
          return;
        }
        dispatch({
          type: `${teamConstants.GET_TEAM_DETAILS}_FAILED`,
          payload: { error : "404" },
        });
      });
    } catch (error) {
      dispatch({
        type: `${teamConstants.GET_TEAM_DETAILS}_FAILED`,
        payload: {
          error,
        },
      });
    }
  };
};
export const filterTeamList = (filterObj) => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.FILTER_TEAM}_SUCCESS`,
      payload: {
        filterObj,
      },
    });
  };
};
export const clearFilteredTeamList = () => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.CLEAR_FILTERED_TEAM_LIST}_SUCCESS`,
    });
  };
};
export const createNewTeamToFirebase = (team) => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.CREATE_NEW_TEAM}_REQUEST`,
    });
    const unSubCreateTeam = teamTbRef
      .add({
        name: team.name,
        leaderId: team.leader,
        createdAt: new Date(),
      })
      .then((_) => {
        dispatch({
          type: `${teamConstants.CREATE_NEW_TEAM}_SUCCESS`,
          payload: { unSubCreateTeam, message: "Create successfully" },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${teamConstants.CREATE_NEW_TEAM}_FAILED`,
          payload: {
            error,
          },
        });
      });
  };
};
export const editTeamDetailsToFirebase = (team) => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.EDIT_TEAM_DETAILS}_REQUEST`,
    });
    const teamIdOfNewLeader = await (
      await membersTbRef.doc(team.leader).get()
    ).data.teamId;
    const oldLeaderId = (await teamTbRef.doc(team.id).get()).data().leaderId;
    const teamIdOfOldLeader = (await membersTbRef.doc(oldLeaderId).get()).data()
      .teamId;
    if (teamIdOfOldLeader !== teamIdOfNewLeader) {
      membersTbRef.doc(team.leader).update({
        teamId: teamIdOfOldLeader,
      });
    }
    const unSubEditTeam = teamTbRef
      .doc(team.id)
      .update({
        leaderId: team.leader,
      })
      .then((_) => {
        dispatch({
          type: `${teamConstants.EDIT_TEAM_DETAILS}_SUCCESS`,
          payload: { unSubEditTeam, message: "Edit successfully" },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${teamConstants.EDIT_TEAM_DETAILS}_FAILED`,
          payload: {
            error,
          },
        });
      });
  };
};
export const removeTeamFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${teamConstants.DELETE_TEAM}_REQUEST`,
    });
    const unSubDeleteTeam = teamTbRef
      .doc(id)
      .delete()
      .then(() => {
        dispatch({
          type: `${teamConstants.DELETE_TEAM}_SUCCESS`,
          payload: {
            message: "Delete successfully",
            unSubDeleteTeam,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${teamConstants.DELETE_TEAM}_FAILED`,
          payload: {
            message: error.message,
          },
        });
      });
  };
};
export const clearTeamErrorMessage = ()=>{
  return async (dispatch) => {
    dispatch({
      type : `${teamConstants.CLEAR_TEAM_ERROR_MESSAGE}_SUCCESS`
    })
  }
}