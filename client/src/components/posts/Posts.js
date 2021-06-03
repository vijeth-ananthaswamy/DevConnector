import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PostItem from './PostItem';
import PostForm from './PostForm';
import Spinner from '../layout/Spinner';
import { getPostsAction } from '../../actions/post';

const Posts = ({ getPostsAction, post: { posts, loading } }) => {
  useEffect(() => {
    getPostsAction();
  }, [getPostsAction]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Welcome to the community
      </p>
      <PostForm />
      <div className='posts'>
        {posts.map((post) => (
          <PostItem key={post._id} post={post}></PostItem>
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPostsAction: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
  };
};

export default connect(mapStateToProps, { getPostsAction })(Posts);
