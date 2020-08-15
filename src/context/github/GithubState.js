import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from "../types";

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== "production") {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const USERS_URL = `https://api.github.com/users`;
const SEARCH_URL = `https://api.github.com/search/users`;
const CLIENT = `client_id=${githubClientId}&client_secret=${githubClientSecret}`;

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // search users
  const searchUsers = async (text) => {
    setLoading(true);

    // request
    const res = await axios.get(`${SEARCH_URL}?q=${text}&${CLIENT}`);

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items,
    });
  };

  // get user
  const getUser = async (user) => {
    setLoading(true);

    const res = await axios.get(`${USERS_URL}/${user}?${CLIENT}`);

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  };

  // get repos
  const getUserRepos = async (user) => {
    setLoading();

    const res = await axios.get(
      `${USERS_URL}/${user}/repos?per_page=5&sort=created:asc&${CLIENT}`
    );

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  };

  // clear users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // set loading
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
