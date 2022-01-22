import {
    LOGIN_SUCCESS,
    LOGOUT,
  } from "./types";
    
  export const loggedIn = (user) => (dispatch) => {
    console.log(" logged-in action : ", user)
    return () => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user },
        });
      }
  };
  
  export const logout = () => (dispatch) => {
    return () => {
      dispatch({
        type: LOGOUT,
      });
    }
  };