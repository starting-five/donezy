// File: client/src/redux/store.js
// Description: This file creates the Redux store and applies middleware for debugging.

import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
