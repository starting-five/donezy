// File: client/src/redux/reducers/settingsReducer.js
// Description: This file contains the settings reducer for managing settings-related state in a Redux store.

const initialState = {
    user: null,
    postTypes: [],
    isModalOpen: false,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_USER_COMPANY":
      return {
        ...state,
        user: {
          ...state.user,
          company: action.payload,
        },
      };
    case "SET_POST_TYPES":
      return {
        ...state,
        postTypes: action.payload
      };
    case "ADD_POST_TYPE":
      return {
        ...state,
        postTypes: [...state.postTypes, action.payload]
      };
    case "TOGGLE_SETTINGS_MODAL":
      return {
        ...state,
        isModalOpen: !state.isModalOpen
      };
    default:
      return state;
  }
};

export default settingsReducer;
