import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
  } from "../actions/types";
  let initialState = { isLoggedIn: false, user: null };
  const local_stor_user = localStorage.getItem("user");

  if(local_stor_user) {
    const {accessToken, user} = JSON.parse(local_stor_user);
    console.log("initial state : ", user)
    initialState = { isLoggedIn: true, user: {accessToken, ...user} }
  }
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
    console.log("reducer : ", type, payload)
    switch (type) {
      case REGISTER_SUCCESS:
        return {
          ...state,
          isLoggedIn: false,
        };
      case REGISTER_FAIL:
        return {
          ...state,
          isLoggedIn: false,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoggedIn: true,
          user: payload,
        };
      case LOGIN_FAIL:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      default:
        return state;
    }
  }