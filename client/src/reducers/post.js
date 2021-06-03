/* eslint-disable import/no-anonymous-default-export */
import { post } from 'request';
import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  SET_POSTS_LOADING,
  DELETE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  UPDATE_LIKES,
  POST_ERROR,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return { ...state, posts: payload, loading: false };

    case GET_POST:
      return { ...state, post: payload, loading: false };

    case ADD_POST:
      return { ...state, posts: [payload, ...state.posts], loading: false };

    case DELETE_POST:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post._id !== payload),
      };

    case ADD_COMMENT:
      return {
        ...state,
        loading: false,
        post: { ...state.post, comments: payload },
      };

    case REMOVE_COMMENT:
      return {
        ...state,
        loading: false,
        post: {...state.post, comments: state.post.comments.filter((comment) => comment._id !== payload)}
      }

    case SET_POSTS_LOADING:
      return { ...state, loading: true };

    case POST_ERROR:
      return { ...state, error: payload, loading: false };

    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === payload.id) {
            return { ...post, likes: payload.likes };
          } else {
            return post;
          }
        }),
        loading: false,
      };

    default:
      return state;
  }
}
