import React from "react";
import axios from "axios";

import {
  NULL_VALUE_ALERT,
  CLEAR_ALERT,
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
  GET_ALL_JOBS_BEGIN,
  GET_ALL_JOBS_SUCCESS,
  SET_EDIT_JOB,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  DELETE_JOB_BEGIN,
  GET_JOB_STATS_BEGIN,
  GET_JOB_STATS_SUCCESS,
  TOGGLE_SIDEBAR,
  HANDLE_INPUT_CHANGE,
  CLEAR_INPUT_VALUES,
  CHANGE_PAGE,
} from "../../constants";
import appReducer from "./app-reducer";

const AppContext = React.createContext();

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
  token: token || null,
  user: user ? JSON.parse(user) : null,
  userLocation: location || "",
  position: "",
  company: "",
  jobLocation: location || "",
  jobTypeOptions: ["full-time", "part-time", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "accepted", "declined"],
  status: "pending",
  editJobId: "",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

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
      const { data } = await authFetch.patch("/users/updateUser", currentUser);
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

      await authFetch.post("/jobs", {
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

    clearAlert();
  };

  const getAllJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    if (search) url = url + `&search=${search}`;

    dispatch({ type: GET_ALL_JOBS_BEGIN });

    try {
      const { data } = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;

      dispatch({
        type: GET_ALL_JOBS_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (error) {
      logoutUser();
    }
  };

  const getJobStats = async () => {
    dispatch({ type: GET_JOB_STATS_BEGIN });

    try {
      const { data } = await authFetch.get("/jobs/job-stats");

      dispatch({
        type: GET_JOB_STATS_SUCCESS,
        payload: {
          stats: data.stats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });

      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_INPUT_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;

      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { message: error.response.data.message },
      });
    }

    clearAlert();
  };

  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${id}`);
      getAllJobs();
    } catch (error) {
      logoutUser();
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

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
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
        getAllJobs,
        getJobStats,
        setEditJob,
        editJob,
        deleteJob,
        toggleSidebar,
        handleInputChange,
        clearInputValues,
        changePage,
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

function useAppContext() {
  return React.useContext(AppContext);
}

export { AppProvider, useAppContext, initialState };
