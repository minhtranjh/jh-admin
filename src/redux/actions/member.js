import firebase from "../../firebase/firebaseConfig";
import { members as memberConstants } from "../contants/index";
const firestore = firebase.firestore();
const storage = firebase.storage().ref();

const membersTbRef = firestore.collection("members_tb");
const positionTbRef = firestore.collection("positions_tb");
const teamTbRef = firestore.collection("teams_tb");
const getPositionById = async (positionId) => {
  const getPositionSnap = await positionTbRef.doc(positionId).get();
  return getPositionSnap.exists
    ? { ...getPositionSnap.data(), id: getPositionSnap.id }
    : undefined;
};
const getTeamById = async (teamId) => {
  if (teamId) {
    const getTeamSnap = await teamTbRef.doc(teamId).get();
    return getTeamSnap.exists
      ? { ...getTeamSnap.data(), id: getTeamSnap.id }
      : undefined;
  }
};
const getTeamNameByLeaderId = async (leaderId) => {
  let team;
  const getTeamByLeaderIdSnap = await teamTbRef
    .where("leaderId", "==", leaderId)
    .get();
  getTeamByLeaderIdSnap.forEach((doc) => {
    team = { ...doc.data(), id: doc.id };
  });
  return team;
};
const getManagedByLeaderId = async (leaderId) => {
  const snap = await membersTbRef.doc(leaderId).get();
  return snap.exists ? { ...snap.data(), id: snap.id } : undefined;
};
const isDoneLoopingSnapshot = (index, size) => {
  return index === size;
};
const pushPictureToStorage = async (file) => {
  if (file) {
    const name = new Date() + "-" + file.name;
    const type = file.type;
    const snap = await storage.child(name).put(file, type);
    return snap.ref.getDownloadURL();
  }
  return;
};
export const createNewMemberToFirebase = (member) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.CREATE_NEW_MEMBER}_REQUEST`,
    });
    let url;
    if (member.picture.type) {
      url = await pushPictureToStorage(member.picture);
    }
    const unsubCreateMember = membersTbRef
      .add({
        ...member,
        teamId: member.team,
        dateOfBirth: new Date(member.dateOfBirth),
        joinedDate: new Date(),
        picture: url ? url : "",
      })
      .then((_) => {
        dispatch({
          type: `${memberConstants.CREATE_NEW_MEMBER}_SUCCESS`,
          payload: {
            unsubCreateMember,
            message: "Create successfully",
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${memberConstants.CREATE_NEW_MEMBER}_FAILED`,
          payload: {
            error: error.message,
          },
        });
      });
  };
};
const formatInputDate = (d) => {
  const date = new Date(d.toDate().toDateString());
  const formattedDate =
    date.getFullYear() +
    "-" +
    (Number(date.getMonth() + 1) < 10
      ? "0" + Number(date.getMonth() + 1)
      : Number(date.getMonth() + 1)) +
    "-" +
    (Number(date.getDate()) < 10
      ? "0" + Number(date.getDate())
      : Number(date.getDate()));
  return formattedDate;
};
export const getMemberDetailsFromTempList = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.GET_MEMBER_DETAILS_FROM_TEMP_LIST}_SUCCESS`,
      payload: { id },
    });
  };
};
export const getMemberDetailsByIdFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.GET_MEMBER_DETAILS}_REQUEST`,
    });
    try {
      if (id) {
        const unsubscribeMemberDetails = membersTbRef
          .doc(id)
          .onSnapshot(async (doc) => {
            if (doc.exists) {
              const position = await getPositionById(doc.data().position);
              const team = await getTeamById(doc.data().teamId);
              const birth = doc.data().dateOfBirth;
              const formattedBirth = formatInputDate(birth);
              const memberDetails = {
                ...doc.data(),
                id: doc.id,
                position: position ? position.id : "",
                team: team ? team.id : "",
                dateOfBirth: formattedBirth,
              };
              dispatch({
                type: `${memberConstants.GET_MEMBER_DETAILS}_SUCCESS`,
                payload: { memberDetails, unsubscribeMemberDetails },
              });
              return
            }
            dispatch({
              type: `${memberConstants.GET_MEMBER_DETAILS}_FAILED`,
              payload: { error: "Not found" },
            });
          });
      }
    } catch (error) {
      dispatch({
        type: `${memberConstants.GET_MEMBER_DETAILS}_FAILED`,
        payload: {
          error: error.message,
        },
      });
    }
  };
};
export const filterMemberFromFirebase = () => {
  return async (dispatch) => {};
};
export const filterListMember = (filterObj) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.FILTER_MEMBER}_SUCCESS`,
      payload: {
        filterObj,
      },
    });
  };
};
export const clearFilteredMemberList = () => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.CLEAR_FILTER_LIST}_SUCCESS`,
    });
  };
};
export const getMemberDoesNotManageAnyTeam = () => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.GET_MEMBER_NOT_MANAGE_TEAM}_REQUEST`,
    });
  };
};
export const getListMembersFromFirebase = () => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.GET_LIST_MEMBERS}_REQUEST`,
    });
    const unsubscribe = membersTbRef
      .orderBy("joinedDate", "desc")
      .onSnapshot((snap) => {
        const memberList = [];
        let index = 0;
        snap.forEach(async (doc) => {
          let managedBy;
          const member = { ...doc.data(), id: doc.id };
          const memberPosition = await getPositionById(member.position);
          const team = await getTeamById(member.teamId);
          const leaderOfTeam = await getTeamNameByLeaderId(member.id);
          if (team) {
            managedBy = await getManagedByLeaderId(team.leaderId);
          }
          const formattedJoinedDate = member.joinedDate.toDate().toDateString();
          memberList.push({
            ...member,
            id: member.id,
            team: team ? team.name : undefined,
            name: member.lastName + " " + member.firstName,
            leaderOf: leaderOfTeam ? leaderOfTeam.name : undefined,
            managedBy: managedBy
              ? {
                  name: managedBy.lastName + " " + managedBy.firstName,
                  id: managedBy.id,
                }
              : undefined,
            joinedDate: formattedJoinedDate,
            position: memberPosition ? memberPosition.name : undefined,
          });
          index++;
          if (isDoneLoopingSnapshot(index, snap.size)) {
            dispatch({
              type: `${memberConstants.GET_LIST_MEMBERS}_SUCCESS`,
              payload: { memberList, unsubscribe },
            });
          }
        });
      });
  };
};
export const editMemberDetailsToFirebase = (member) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.EDIT_MEMBER_DETAILS}_REQUEST`,
    });
    let url;
    if (member.picture.type) {
      url = await pushPictureToStorage(member.picture);
    }
    const unsubEditMember = membersTbRef
      .doc(member.id)
      .update({
        ...member,
        teamId: member.team,
        joinedDate: new Date(),
        dateOfBirth: new Date(member.dateOfBirth),
        picture: url ? url : member.picture,
      })
      .then((_) => {
        dispatch({
          type: `${memberConstants.EDIT_MEMBER_DETAILS}_SUCCESS`,
          payload: {
            unsubEditMember,
            message: "Edit successfully",
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${memberConstants.EDIT_MEMBER_DETAILS}_FAILED`,
          payload: {
            error: error.message,
          },
        });
      });
  };
};
export const removeMemberFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.DELETE_MEMBER}_REQUEST`,
    });
    const unSubDeleteTeam = membersTbRef
      .doc(id)
      .delete()
      .then(() => {
        dispatch({
          type: `${memberConstants.DELETE_MEMBER}_SUCCESS`,
          payload: {
            message: "Delete successfully",
            unSubDeleteTeam,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: `${memberConstants.DELETE_MEMBER}_FAILED`,
          payload: {
            message: error.message,
          },
        });
      });
  };
};

export const clearMemberErrorMessage = () => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.CLEAR_MEMBER_ERROR_MESSAGE}_SUCCESS`,
    });
  };
};
