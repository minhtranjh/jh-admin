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
  if(teamId){
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
  const name = new Date() + "-" + file.name;
  const type = file.type;
  const snap = await storage.child(name).put(file, type);
  return snap.ref.getDownloadURL();
};
export const createNewMemberToFirebase = (member) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.CREATE_NEW_MEMBER}_REQUEST`,
    });
    const url = await pushPictureToStorage(member.picture.value);
    const unsubscribeCreateMember = membersTbRef
      .add({
        firstName: member.firstName.value,
        lastName: member.lastName.value,
        gender: member.gender.value,
        dateOfBirth: new Date(member.dateOfBirth.value),
        phone: member.phone.value,
        position: member.position.value,
        teamId: member.team.value,
        email: member.email.value,
        about: member.about.value,
        joinedDate: new Date(),
        picture: url,
      })
      .then((_) => {
        dispatch({
          type: `${memberConstants.CREATE_NEW_MEMBER}_SUCCESS`,
          payload: {
            unsubscribeCreateMember,
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
export const setMemberDetailFromTempList = (memberDetails) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.SET_MEMBER_DETAILS_FROM_TEMP_LIST}_REQUEST`,
    });
    setTimeout(() => {
      dispatch({
        type: `${memberConstants.SET_MEMBER_DETAILS_FROM_TEMP_LIST}_SUCCESS`,
        payload: {
          memberDetails,
        },
      });
    });
  };
};
export const getMemberDetailsByIdFromFirebase = (id) => {
  return async (dispatch) => {
    dispatch({
      type: `${memberConstants.GET_MEMBER_DETAILS}_REQUEST`,
    });
    try {
      const unsubscribeMemberDetails = membersTbRef
        .doc(id)
        .onSnapshot(async (doc) => {
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
        });
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
export const filterMemberFromFirebase = ()=>{
  return async (dispatch) => {

  }
}
export const filterListMember = (filterObj)=>{
  return async (dispatch) => {
  
    dispatch({
      type : `${memberConstants.FILTER_MEMBER}_SUCCESS`,
      payload : {
        filterObj
      }
    })
    
  }
}
export const clearFilteredMemberList = ()=>{
  return async (dispatch) => {
    dispatch({
      type : `${memberConstants.CLEAR_FILTER_LIST}_SUCCESS`,

    })
  }
}
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
            name: member.firstName + " " + member.lastName,
            leaderOf: leaderOfTeam ? leaderOfTeam.name : undefined,
            managedBy: managedBy
              ? {
                  name: managedBy.firstName + " " + managedBy.lastName,
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
    if (member.picture.value.type) {
      url = await pushPictureToStorage(member.picture.value);
    }
    const unsubscribeEditMemberDetails = membersTbRef
      .doc(member.id)
      .update({
        firstName: member.firstName.value,
        lastName: member.lastName.value,
        gender: member.gender.value,
        email: member.email.value,
        dateOfBirth: new Date(member.dateOfBirth.value),
        phone: member.phone.value,
        position: member.position.value,
        teamId: member.team.value,
        about: member.about.value,
        joinedDate: new Date(),
        picture: url ? url : member.picture.value,
      })
      .then((_) => {
        dispatch({
          type: `${memberConstants.EDIT_MEMBER_DETAILS}_SUCCESS`,
          payload: {
            unsubscribeEditMemberDetails,
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
