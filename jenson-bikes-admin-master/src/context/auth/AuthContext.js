import React, { createContext, useReducer, useCallback } from 'react';
import userReducer from './AuthReducer';
import axios from 'axios';
import * as types from './authActionTypes';
import mernDashApi from 'src/helpers/apiUtils';

const initialAuthState = {
  loading: false,
  error: false,
  token: null,
  errResponse: null
};

export const AuthContext = createContext(initialAuthState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialAuthState);

  const AuthReset = () => {
    dispatch({
      type: types.AUTH_RESET
    });
  };

  const UpdatePasswordAction = useCallback(async (data) => {
    try {
      const res = await mernDashApi.post('/api/auth/change-password', data);
      localStorage.removeItem('mern_admin_dashboard');
      return {status: true}
    } catch (error) {
      return {status: false,error_msg:error.response.data.error_msg}
    }
  }, []);

  const LoginAction = useCallback(async (data) => {
    dispatch({
      type: types.AUTH_START
    });
    try {
      const res = await axios.post('/api/auth/login', data);
      localStorage.setItem('mern_admin_dashboard', res.data.access_token);
      dispatch({
        type: types.AUTH_SUCCESS,
        payload: res.data.access_token
      });
      return {status: true}
    } catch (error) {
      dispatch({
        type: types.AUTH_FAILURE,
        payload: error.response.data.error_msg
      });
      return {status: false,error_msg:error.response.data.error_msg}
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        AuthReset,
        LoginAction,
        UpdatePasswordAction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
