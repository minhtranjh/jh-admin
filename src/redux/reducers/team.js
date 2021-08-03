import { team as teamConstants } from "../contants/index";
const initialState = {
  teamList: [],
  filteredTeamList: [],
  teamDetails: {},
  isLoading: false,
  isTeamDetailsEditting: false,
  isTeamDetailsLoading: false,
  isCreating: false,
  isDeleting: false,
  isFiltering: false,
};
const handleFilterList = (list, filterObj) => {
  const newMemberList = list.filter((value) => {
    for (var key in filterObj) {
      const query = filterObj[key].value.toLowerCase();
      if (!value[key] || !value[key].toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });
  return newMemberList;
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
        error : "",

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
        error : "",
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
        error : "",

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
        error : "",

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
        error : "",

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
    case `${teamConstants.FILTER_TEAM}_SUCCESS`:
      const { filterObj } = action.payload;
      const newlist = handleFilterList(state.teamList, filterObj);
      state = {
        ...state,
        isFiltering: true,
        error : "",

        filteredTeamList: newlist,
      };
      return state;
    case `${teamConstants.CLEAR_FILTERED_TEAM_LIST}_SUCCESS`:
      state = {
        ...state,
        filteredTeamList: [],
        error : "",

        isFiltering: false,
      };
      return state;
      case `${teamConstants.CLEAR_TEAM_ERROR_MESSAGE}_SUCCESS`:
        state = {
          ...state,
          error: "",
        };
        return state;
    default:
      return state;
  }
};
