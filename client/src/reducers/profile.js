/* eslint-disable import/no-anonymous-default-export */
import {
  GET_PROFILE,
  GET_ALL_PROFILES,
  GET_PROFILE_BY_USERID,
  GET_GITHUB_REPOS,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  SET_LOADING,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false };

    case GET_PROFILE_BY_USERID:
      return { ...state, profile: payload, loading: false };

    case GET_GITHUB_REPOS:
      return { ...state, repos: payload, loading: false };

    case GET_ALL_PROFILES:
      return { ...state, profiles: payload, loading: false };

    case PROFILE_ERROR:
      return { ...state, error: payload, loading: false, profile: null };

    case CLEAR_PROFILE:
      return { ...state, profile: null, repos: [], loading: false };

    case SET_LOADING: {
      return { ...state, loading: true };
    }

    default:
      return state;
  }
}
