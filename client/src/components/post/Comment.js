import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addCommentAction } from '../../actions/post';

const Comment = ({ postId, addCommentAction }) => {
  const [comment, setComment] = useState('');
  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Leave a comment</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={(e) => {
          e.preventDefault();
          console.log(postId, comment);
          addCommentAction(postId, { text: comment });
          setComment('');
        }}>
        <textarea
          name='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          cols='30'
          rows='5'
          placeholder='Enter a comment'
          required></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

Comment.propTypes = {
  addCommentAction: PropTypes.func.isRequired,
};

export default connect(null, { addCommentAction })(Comment);
