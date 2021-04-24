import React, { createContext, useReducer } from "react";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

const cookies = new Cookies();
const initialState = {
  user: null,
};
if (cookies.get("d_token")) {
  const decodedToken = jwtDecode(cookies.get("d_token"));

  if (decodedToken.exp * 1000 < Date.now()) {
    cookies.remove("d_token");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    cookies.set("d_token", userData.token, { path: "/" });
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    cookies.remove("d_token");
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
