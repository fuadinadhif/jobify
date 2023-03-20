import React from "react";
import axios from "axios";

import {
  CLEAR_ALERT,
  NULL_VALUE_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  LOGOUT_USER,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  TOGGLE_SIDEBAR,
  HANDLE_INPUT_CHANGE,
  CLEAR_INPUT_VALUES,
} from "../constants";
import appReducer from "../helpers/app-reducer";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const location = localStorage.getItem("location");
const initialState = {
  isEditing: false,
  isLoading: false,
  showAlert: false,
  showSidebar: false,
  alertType: "",
  alertText: "",
  user: user ? JSON.parse(user) : null,
  token: token || null,
  userLocation: location || "",
  jobLocation: location || "",
  editJobId: "",
  position: "",
  company: "",
  jobTypeOptions: ["full-time", "part-time", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "accepted", "declined"],
  status: "pending",
};

const AppContext = React.createContext();

const useAppContext = () => React.useContext(AppContext);

const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  // Axios interceptors
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }

      return Promise.reject(error);
    }
  );
  // End of Axios interceptors

  // Alert functions
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const displayNullAlert = () => {
    dispatch({ type: NULL_VALUE_ALERT });
    clearAlert();
  };
  // End of alert functions

  // User functions
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

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });

    try {
      const { data } = await authFetch.patch("/user/updateUser", currentUser);
      const { user, token, location } = data;

      addToLocalStorage({ user, token, location });

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, location },
      });
    } catch (error) {
      if (error.response.satus !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { message: error.response.data.message },
        });
      }
    }

    clearAlert();
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeFromLocalStorage();
  };
  // End of user functions

  // Job functions
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });

    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.post("/job", {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });

      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_INPUT_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;

      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { message: error.response.data.message },
      });
    }
  };
  // End of job functions

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const handleInputChange = ({ name, value }) => {
    dispatch({ type: HANDLE_INPUT_CHANGE, payload: { name, value } });
  };

  const clearInputValues = () => {
    dispatch({ type: CLEAR_INPUT_VALUES });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayNullAlert,
        setupUser,
        updateUser,
        logoutUser,
        createJob,
        toggleSidebar,
        handleInputChange,
        clearInputValues,
      }}
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
