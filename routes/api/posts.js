const express = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../../middlewares/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

const router = express.Router();

const validations = [check('text', 'Text is required').not().isEmpty()];
router.post('/', auth, validations, async (req, res) => {
  const { text } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id).select('-password');

  try {
    const post = new Post({
      text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }

  res.send('Posts route');
});

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Internal server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post deleted succesfully' });
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Internal server error');
  }
});

router.put('/like/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Internal server error');
  }
});

router.put('/unlike/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    const index = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    post.likes.splice(index, 1);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Internal server error');
  }
});

const commentValidations = [check('text', 'Text is required').not().isEmpty()];

router.post('/comment/:id', auth, commentValidations, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    const commentedUser = await User.findById(req.user.id);

    const comment = {
      user: req.user.id,
      text,
      name: commentedUser.name,
      avatar: commentedUser.avatar,
    };

    post.comments.unshift(comment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Internal server error');
  }
});

router.delete('/comment/:id/:commentId', auth, async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    const index = post.comments.findIndex(
      (comment) => comment.id === commentId
    );

    const comment = post.comments[index];

    if (!comment) {
      return res.status(404).json({ msg: 'No comment found' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments.splice(index, 1);
    await post.save();
    res.send(post.comments);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
