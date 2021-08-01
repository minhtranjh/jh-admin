import { position as positionContstants } from "../contants/index";
const initialState = {
  positionList: [],
  positionDetails: {},
  isPositionDetailsLoading: false,
  isPositionDetailsEditting: false,
  isCreating: false,
  isLoading: false,
  isDeleting: false,
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
        isPositionDetailsEditting: true,
      };
      return state;
    case `${positionContstants.EDIT_POSITION_DETAILS}_SUCCESS`:
      state = {
        ...state,
        ...action.payload,
        isPositionDetailsEditting: false,
      };
      return state;
    case `${positionContstants.EDIT_POSITION_DETAILS}_FAILED`:
      state = {
        ...state,
        ...action.payload,
        isPositionDetailsEditting: true,
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
    default:
      return state;
  }
};
