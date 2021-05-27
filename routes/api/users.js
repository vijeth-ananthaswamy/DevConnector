const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

const router = express.Router();

const validations = [
  check('name', 'Name is required').trim().not().isEmpty(),
  check('email', 'Email should be valid').isEmail(),
  check(
    'password',
    'Password should be of length 6 or more characters'
  ).isLength({ min: 6 }),
];

router.post('/', validations, async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the user exists. If yes, send error message
    const fetchedUser = await User.findOne({ email });
    if (fetchedUser) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    //Get user's gravatar and
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    //Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    //Save the user to the database
    const user = new User({
      name,
      email,
      avatar,
      password: encryptedPassword,
    });

    await user.save();

    //Create and return a jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        expiresIn: 36000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
