import * as types from './appActionTypes';

export default (state, action) => {
  switch (action.type) {
    case types.SET_NOTIFICATION:
      return {
        ...state,
        notification: {error:action.payload.error,message:action.payload.message}
      };

    default:
      return state;
  }
};
