// File: client/src/redux/actions/settingsAction.js
// Description: This file contains action creators for managing settings in a Redux store.

export const FETCH_USER = "FETCH_USER";

export const toggleSettingsModal = () => {
  return {
    type: "TOGGLE_SETTINGS_MODAL"
  };
};

export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: user,
  };
};

export const setUserCompany = (company) => {
  return {
    type: "SET_USER_COMPANY",
    payload: company,
  };
}

export const setPostTypes = (postTypes) => {
  return {
    type: "SET_POST_TYPES",
    payload: postTypes,
  };
};

export const addPostType = (postType) => {
  return {
    type: "ADD_POST_TYPE",
    payload: postType
  }
}
