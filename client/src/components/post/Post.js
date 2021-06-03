import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PostItem from '../posts/PostItem';
import CommentItem from './CommentItem';
import Comment from './Comment';
import Spinner from '../layout/Spinner';
import { getPostAction } from '../../actions/post';

const Post = ({ post: { post, loading }, getPostAction, match }) => {
  useEffect(() => {
    getPostAction(match.params.id);
  }, [getPostAction, match.params.id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to={'/posts'} className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <Comment postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPostAction: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
  };
};

export default connect(mapStateToProps, { getPostAction })(Post);
