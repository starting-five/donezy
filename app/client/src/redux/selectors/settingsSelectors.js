// File: client/src/redux/selectors/settingsSelectors.js
// Description: This file contains selectors for accessing settings-related state in a Redux store.

export const getUserId = (state) =>
  state.settings && state.settings.user && state.settings.user.id;

export const getUser = (state) =>
  state.settings && state.settings.user;

export const getPostTypes = (state) => 
  state.settings && state.settings.postTypes;
