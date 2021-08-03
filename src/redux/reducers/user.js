import { user as userConstants } from "../contants/index";
const initialState = {
  userList: [],
  filteredUserList: [],
  userDetailsTempList: [],
  userDetails: {},
  isLoading: false,
  isUserDetailsEditting: false,
  isUserDetailsLoading: false,
  isCreating: false,
  isDeleting: false,
  isFiltering: false,
  isActivatingUser: false,
  isUnactivatingUser: false,
};
const handleFilterList = (list, filterObj) => {
  const newMemberList = list.filter((value) => {
    for (var key in filterObj) {
      const query = String(filterObj[key].value).toLowerCase();
      if (
        !String(value[key]) ||
        !String(value[key]).toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });
  return newMemberList;
};
export default (state = initialState, action) => {
  switch (action.type) {
    case `${userConstants.GET_USER_LIST}_REQUEST`:
      state = {
        ...state,
        isLoading: true,
      };
      return state;
    case `${userConstants.GET_USER_LIST}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isLoading: false,
      };
      return state;
    case `${userConstants.GET_USER_LIST}_FAILED`:
      state = {
        ...state,
        ...action,
        isLoading: true,
      };
      return state;
    case `${userConstants.GET_USER_DETAILS}_REQUEST`:
      state = {
        ...state,
        isUserDetailsLoading: true,
      };
      return state;
    case `${userConstants.GET_USER_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isUserDetailsLoading: false,
      };
      return state;
    case `${userConstants.GET_USER_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isUserDetailsLoading: false,
      };
      return state;
    case `${userConstants.CREATE_NEW_USER}_REQUEST`:
      state = {
        ...state,
        isCreating: true,
      };
      return state;
    case `${userConstants.CREATE_NEW_USER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isCreating: false,
      };
      return state;
    case `${userConstants.CREATE_NEW_USER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isCreating: false,
      };
      return state;
    case `${userConstants.EDIT_USER_DETAILS}_REQUEST`:
      state = {
        ...state,
        isUserDetailsEditting: true,
      };
      return state;
    case `${userConstants.EDIT_USER_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isUserDetailsEditting: false,
      };
      return state;
    case `${userConstants.EDIT_USER_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isUserDetailsEditting: true,
      };
      return state;
    case `${userConstants.DELETE_USER}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    case `${userConstants.DELETE_USER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isDeleting: false,
      };
      return state;
    case `${userConstants.DELETE_USER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: false,
      };
      return state;
    case `${userConstants.FILTER_USER}_SUCCESS`:
      const { filterObj } = action.payload;
      const newlist = handleFilterList(state.userList, filterObj);
      state = {
        ...state,
        isFiltering: true,
        error : "",

        filteredUserList: newlist,
      };
      return state;
    case `${userConstants.CLEAR_FILTERED_USER_LIST}_SUCCESS`:
      state = {
        ...state,
        filteredUserList: [],
        error : "",

        isFiltering: false,
      };
      return state;
    case `${userConstants.ACTIVE_USER}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isActivatingUser: true,
      };
      return state;
    case `${userConstants.ACTIVE_USER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isActivatingUser: false,
      };
      return state;
    case `${userConstants.ACTIVE_USER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isActivatingUser: false,
      };
    case `${userConstants.UNACTIVE_USER}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isUnactivatingUser: true,
      };
      return state;
    case `${userConstants.UNACTIVE_USER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isUnactivatingUser: false,
      };
      return state;
    case `${userConstants.UNACTIVE_USER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isUnactivatingUser: false,
      };
      return state;
    case `${userConstants.CLEAR_USER_ERROR_MESSAGE}_SUCCESS`:
      state = {
        ...state,
        error: "",
      };
      return state;
    default:
      return state;
  }
};
