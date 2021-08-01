import { members as memberConstants } from "../contants/index";
const initialState = {
  memberList: [],
  filteredMemberList: [],
  memberDetailsTempList: [],
  memberDetails: {},
  isLoading: false,
  isMemberDetailsLoading: false,
  isEditting: false,
  isDeleting: false,
  isCreating: false,
  isFiltering : false,
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
    case `${memberConstants.GET_LIST_MEMBERS}_REQUEST`:
      state = {
        ...state,
        isLoading: true,
      };
      return state;
    case `${memberConstants.GET_LIST_MEMBERS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isLoading: false,
      };
      return state;
    case `${memberConstants.GET_LIST_MEMBERS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isLoading: false,
      };
      return state;
    case `${memberConstants.CREATE_NEW_MEMBER}_REQUEST`:
      state = {
        ...state,
        isCreating: true,
      };
      return state;
    case `${memberConstants.CREATE_NEW_MEMBER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isCreating: false,
      };
      return state;
    case `${memberConstants.CREATE_NEW_MEMBER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isCreating: false,
      };
      return state;
    case `${memberConstants.SET_MEMBER_DETAILS_FROM_TEMP_LIST}_REQUEST`:
      state = {
        ...state,
        isMemberDetailsLoading: true,
      };
      return state;
    case `${memberConstants.SET_MEMBER_DETAILS_FROM_TEMP_LIST}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isMemberDetailsLoading: false,
      };
      return state;
    case `${memberConstants.GET_MEMBER_DETAILS}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isMemberDetailsLoading: true,
      };
      return state;

    case `${memberConstants.GET_MEMBER_DETAILS}_SUCCESS`:
      const newArr = [...state.memberDetailsTempList];
      newArr.push(action.payload.memberDetails);
      state = {
        ...state,
        ...action.payload,
        memberDetailsTempList: newArr,
        isMemberDetailsLoading: false,
      };
      return state;
    case `${memberConstants.GET_MEMBER_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isMemberDetailsLoading: false,
      };
      return state;
    case `${memberConstants.EDIT_MEMBER_DETAILS}_REQUEST`:
      state = {
        ...state,
        isEditting: true,
      };
      return state;
    case `${memberConstants.EDIT_MEMBER_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isEditting: false,
      };
      return state;
    case `${memberConstants.EDIT_MEMBER_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isEditting: false,
      };
      return state;
    case `${memberConstants.DELETE_MEMBER}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    case `${memberConstants.DELETE_MEMBER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: false,
      };
      return state;
    case `${memberConstants.DELETE_MEMBER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    case `${memberConstants.FILTER_MEMBER}_SUCCESS`:
      const { filterObj } = action.payload;
      const newMemberList = handleFilterList(state.memberList, filterObj);
      state = {
        ...state,
        isFiltering : true,
        filteredMemberList: newMemberList,
      };
      return state;
    case `${memberConstants.CLEAR_FILTER_LIST}_SUCCESS` : 
      state = {
        ...state,
        filteredMemberList : [],
        isFiltering : false,
      }
    default:
      return state;
  }
};
