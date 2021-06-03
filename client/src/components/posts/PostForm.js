import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addPostAction } from '../../actions/post';

const PostForm = ({ addPostAction }) => {
  const [text, setText] = useState('');

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={(e) => {
          e.preventDefault();
          addPostAction({ text });
          setText('');
        }}>
        <textarea
          name='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          cols='30'
          rows='5'
          placeholder='Create a post'
          required></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPostAction: PropTypes.func.isRequired,
};

export default connect(null, { addPostAction })(PostForm);
