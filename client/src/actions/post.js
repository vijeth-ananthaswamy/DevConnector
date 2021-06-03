import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  DELETE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  SET_POSTS_LOADING,
  POST_ERROR,
  UPDATE_LIKES,
} from './types';

export const getPostsAction = () => async (dispatch) => {
  try {
    dispatch({ type: SET_POSTS_LOADING });

    const res = await axios.get('/api/posts');

    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getPostAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_POSTS_LOADING });

    const res = await axios.get(`/api/posts/${id}`);

    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addPostAction = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await axios.post('/api/posts', formData, config);

    dispatch({ type: ADD_POST, payload: res.data });

    dispatch(setAlert('Post created...', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deletePostAction = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({ type: DELETE_POST, payload: id });

    dispatch(setAlert('Post deleted...', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addLikeAction = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeLikeAction = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    console.log(res.data);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addCommentAction = (postId, formData) => async (dispatch) => {
  try {
    dispatch({ type: SET_POSTS_LOADING });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );

    dispatch({ type: ADD_COMMENT, payload: res.data });

    dispatch(setAlert('Comment posted...', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteCommentAction = (postId, commentId) => async (dispatch) => {
  try {
    dispatch({ type: SET_POSTS_LOADING });

    const res = await `/api/posts/comment/${postId}/${commentId}`;

    dispatch({ type: REMOVE_COMMENT, payload: commentId });

    dispatch(setAlert('Comment deleted...', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
