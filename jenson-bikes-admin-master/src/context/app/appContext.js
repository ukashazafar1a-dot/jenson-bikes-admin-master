import React, { createContext, useReducer } from 'react';
import userReducer from './appReducer';
import * as types from './appActionTypes';

const initialAppState = {
  notification: {
    error: false,
    message: ''
  }
};

export const AppContext = createContext(initialAppState);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialAppState);

  const setNotification = (error,message) => {
    console.log("setNotification")
    dispatch({
      type: types.SET_NOTIFICATION,
      payload: {error,message}
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
