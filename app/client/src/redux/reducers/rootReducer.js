// File: client/src/redux/reducers/rootReducer.js
// Description: This file combines all the reducers in the Redux store.

import { combineReducers } from 'redux';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  settings: settingsReducer,
});

export default rootReducer;
