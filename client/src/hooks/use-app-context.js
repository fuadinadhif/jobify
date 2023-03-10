import React from "react";
import axios from "axios";

import {
  CLEAR_ALERT,
  NULL_VALUE_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
} from "../constants";
import appReducer from "../helpers/app-reducer";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const location = localStorage.getItem("location");
const initialState = {
  isLoading: false,
  showAlert: false,
  showSidebar: false,
  alertType: "",
  alertText: "",
  user: user ? JSON.parse(user) : null,
  token: token || null,
  userLocation: location || "",
  jobLocation: location || "",
};

const AppContext = React.createContext();
const useAppContext = () => React.useContext(AppContext);
const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const nullValueAlert = () => {
    dispatch({ type: NULL_VALUE_ALERT });
    clearAlert();
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });

    try {
      const response = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );
      const { user, token, location } = await response.data;

      addToLocalStorage({ user, token, location });

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { message: error.response.data.message },
      });
    }

    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeFromLocalStorage();
  };

  return (
    <AppContext.Provider
      value={{ ...state, nullValueAlert, setupUser, toggleSidebar, logoutUser }}
    >
      {children}
    </AppContext.Provider>
  );
};

function addToLocalStorage({ user, token, location }) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  localStorage.setItem("location", location);
}

function removeFromLocalStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("location");
}

export { AppProvider, useAppContext, initialState };
