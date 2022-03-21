import { applyMiddleware, combineReducers, compose, createStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
// allow async dispath functions
import thunk from 'redux-thunk';
import { userReducers, appReducer } from './reducers';

const allReducers = combineReducers({
  user: userReducers,
  app: appReducer
});

// const store = createStore(allReducers, compose(applyMiddleware(thunk)));
const store = createStore(allReducers, compose(applyMiddleware(thunk), composeWithDevTools()));

export default store;