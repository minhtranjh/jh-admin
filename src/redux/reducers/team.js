import { team as teamConstants } from "../contants/index";
const initialState = {
  teamList: [],
  teamDetails: {},
  isLoading: false,
  isTeamDetailsEditting: false,
  isTeamDetailsLoading: false,
  isCreating: false,
  isDeleting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `${teamConstants.GET_TEAM_LIST}_REQUEST`:
      state = {
        ...state,
        isLoading: true,
      };
      return state;
    case `${teamConstants.GET_TEAM_LIST}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isLoading: false,
      };
      return state;
    case `${teamConstants.GET_TEAM_LIST}_FAILED`:
      state = {
        ...state,
        ...action,
        isLoading: true,
      };
      return state;
    case `${teamConstants.GET_TEAM_DETAILS}_REQUEST`:
      state = {
        ...state,
        isTeamDetailsLoading: true,
      };
      return state;
    case `${teamConstants.GET_TEAM_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isTeamDetailsLoading: false,
      };
      return state;
    case `${teamConstants.GET_TEAM_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isTeamDetailsLoading: false,
      };
      return state;
    case `${teamConstants.CREATE_NEW_TEAM}_REQUEST`:
      state = {
        ...state,
        isCreating: true,
      };
      return state;
    case `${teamConstants.CREATE_NEW_TEAM}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isCreating: false,
      };
      return state;
    case `${teamConstants.CREATE_NEW_TEAM}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isCreating: false,
      };
      return state;
    case `${teamConstants.EDIT_TEAM_DETAILS}_REQUEST`:
      state = {
        ...state,
        isTeamDetailsEditting: true,
      };
      return state;
    case `${teamConstants.EDIT_TEAM_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isTeamDetailsEditting: false,
      };
      return state;
    case `${teamConstants.EDIT_TEAM_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isTeamDetailsEditting: true,
      };
      return state;
    case `${teamConstants.DELETE_TEAM}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    case `${teamConstants.DELETE_TEAM}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: false,
      };
      return state;
    case `${teamConstants.DELETE_TEAM}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    default:
      return state;
  }
};
