import { members as memberConstants } from "../contants/index";
const initialState = {
  memberList: [],
  pagedMemberList: [],
  filteredMemberList: [],
  memberDetailsTempList: [],
  memberDetails: {},
  isLoading: false,
  isMemberDetailsLoading: false,
  isEditting: false,
  isDeleting: false,
  isCreating: false,
  isFiltering: false,
  currentPage: 0,
  rowsPerPage: 10,
  totalPages : 0
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
        message: "",
        isLoading: true,
      };
      return state;
    case `${memberConstants.GET_LIST_MEMBERS}_SUCCESS`:
      const initialPage = action.payload.currentPage;
      const initialList = action.payload.memberList;
      const initialRows = action.payload.rowsPerPage;
      const totalPages = Math.floor(initialList.length / initialRows ) + 1
      const list = initialList.slice(
        (initialPage - 1) * initialRows,
        initialRows * initialPage
      );
      state = {
        ...state,
        ...action.payload,
        pagedMemberList: list,
        totalPages ,
        error: "",
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
    case `${memberConstants.GET_PAGED_MEMBERS_LIST}_REQUEST`:
      state = {
        ...state,
        message: "",
        isLoading: true,
      };
      return state;
    case `${memberConstants.GET_PAGED_MEMBERS_LIST}_SUCCESS`:
      const currentPage = action.payload.currentPage;
      const pagedlist = state.memberList;
      const rowsPerPage = action.payload.rowsPerPage;
      const newList = pagedlist.slice((currentPage - 1) * rowsPerPage, rowsPerPage * currentPage);
      state = {
        ...state,
        ...action.payload,
        pagedMemberList: newList,
        error: "",
        isLoading: false,
      };
      return state;
    case `${memberConstants.CREATE_NEW_MEMBER}_REQUEST`:
      state = {
        ...state,
        isCreating: true,
        message: "",
      };
      return state;
    case `${memberConstants.CREATE_NEW_MEMBER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error: "",
        isCreating: false,
      };
      return state;
    case `${memberConstants.CREATE_NEW_MEMBER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        message: "",
        isCreating: false,
      };
      return state;
    case `${memberConstants.GET_MEMBER_DETAILS_FROM_TEMP_LIST}_REQUEST`:
      state = {
        ...state,
        message: "",
        isMemberDetailsLoading: true,
      };
      return state;
    case `${memberConstants.GET_MEMBER_DETAILS_FROM_TEMP_LIST}_SUCCESS`:
      const result = state.memberDetailsTempList.find(
        (item) => item.id === action.payload.id
      );
      state = {
        ...state,
        memberDetails: result ? result : {},
        error: "",
        isMemberDetailsLoading: false,
      };
      return state;
    case `${memberConstants.GET_MEMBER_DETAILS}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        message: "",
        isMemberDetailsLoading: true,
      };
      return state;

    case `${memberConstants.GET_MEMBER_DETAILS}_SUCCESS`:
      const newArr = [...state.memberDetailsTempList];
      newArr.push(action.payload.memberDetails);
      state = {
        ...state,
        ...action.payload,
        error: "",

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
        message: "",
      };
      return state;
    case `${memberConstants.EDIT_MEMBER_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error: "",

        isEditting: false,
      };
      return state;
    case `${memberConstants.EDIT_MEMBER_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        message: "",
        isEditting: false,
      };
      return state;
    case `${memberConstants.DELETE_MEMBER}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        message: "",
        isDeleting: true,
      };
      return state;
    case `${memberConstants.DELETE_MEMBER}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error: "",
        isDeleting: false,
      };
      return state;
    case `${memberConstants.DELETE_MEMBER}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        message: "",
        isDeleting: false,
      };
      return state;
    case `${memberConstants.FILTER_MEMBER}_SUCCESS`:
      const { filterObj } = action.payload;
      const newMemberList = handleFilterList(state.memberList, filterObj);
      state = {
        ...state,
        isFiltering: true,

        error: "",

        filteredMemberList: newMemberList,
      };
      return state;
    case `${memberConstants.CLEAR_FILTER_LIST}_SUCCESS`:
      state = {
        ...state,
        filteredMemberList: [],
        error: "",
        isFiltering: false,
      };
      return state;
    case `${memberConstants.CLEAR_MEMBER_ERROR_MESSAGE}_SUCCESS`:
      state = {
        ...state,
        error: "",
      };
      return state;
    default:
      return state;
  }
};
