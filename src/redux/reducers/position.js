import { position as positionContstants } from "../contants/index";
const initialState = {
  positionList: [],
  filteredPositionList: [],
  positionDetails: {},
  isPositionDetailsLoading: false,
  isEditting: false,
  isCreating: false,
  isLoading: false,
  isDeleting: false,
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
    case `${positionContstants.GET_POSITION_LIST}_REQUEST`:
      state = {
        ...state,
        isLoading: true,
      };
      return state;
    case `${positionContstants.GET_POSITION_LIST}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isLoading: false,
      };
      return state;
    case `${positionContstants.GET_POSITION_LIST}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isLoading: true,
      };
      return state;
    case `${positionContstants.GET_POSITION_DETAILS}_REQUEST`:
      state = {
        ...state,
        isPositionDetailsLoading: true,
      };
      return state;
    case `${positionContstants.GET_POSITION_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isPositionDetailsLoading: false,
      };
      return state;
    case `${positionContstants.GET_POSITION_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isPositionDetailsLoading: false,
      };
      return state;
    case `${positionContstants.CREATE_NEW_POSITION}_REQUEST`:
      state = {
        ...state,
        isCreating: true,
      };
      return state;
    case `${positionContstants.CREATE_NEW_POSITION}_SUCCESS`:
      state = {
        ...state,
        
        ...action.payload,
        error : "",

        isCreating: false,
      };
      return state;
    case `${positionContstants.CREATE_NEW_POSITION}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isCreating: false,
      };
      return state;
    case `${positionContstants.EDIT_POSITION_DETAILS}_REQUEST`:
      state = {
        ...state,
        isEditting: true,
      };
      return state;
    case `${positionContstants.EDIT_POSITION_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isEditting: false,
      };
      return state;
    case `${positionContstants.EDIT_POSITION_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isEditting: true,
      };
      return state;
    case `${positionContstants.DELETE_POSITION}_REQUEST`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    case `${positionContstants.DELETE_POSITION}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        error : "",

        isDeleting: false,
      };
      return state;
    case `${positionContstants.DELETE_POSITION}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isDeleting: true,
      };
      return state;
    case `${positionContstants.FILTER_POSITION}_SUCCESS`:
      const { filterObj } = action.payload;
      const newPositionList = handleFilterList(state.positionList, filterObj);
      state = {
        ...state,
        ...action.payload,
        filteredPositionList: newPositionList,
        error : "",
        isFiltering: true,
      };
      return state;

    case `${positionContstants.CLEAR_FILTERED_POSITION_LIST}_SUCCESS`:
      state = {
        ...state,
        filteredPositionList: [],
        error : "",

        isFiltering: false,
      };
      return state;
    case `${positionContstants.CLEAR_POSITION_ERROR_MESSAGE}_SUCCESS`:
      state = {
        ...state,
        error: "",
      };
      return state;
    default:
      return state;
  }
};
