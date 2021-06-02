const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middlewares/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'User',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

const profileValidations = [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty(),
];

router.post('/', auth, profileValidations, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  const profileFields = {};

  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  profileFields.social = {};

  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // Update if profile already exists
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // Create profile , if it does not exist
    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ user: userId }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    res.send(profile);
  } catch (err) {
    console.error(err);

    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    res.status(500).send('Internal server error');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    // Delete user's posts:
    await Post.deleteMany({ user: req.user.id });

    // Delete user profile:
    await Profile.findOneAndDelete({ user: req.user.id });

    // Delete user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);

    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    res.status(500).send('Internal server error');
  }
});

const experienceValidations = [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
];

router.put('/experience', auth, experienceValidations, async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    const experience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    profile.experience.unshift(experience);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.delete('/experience/:expId', auth, async (req, res) => {
  const { expId } = req.params;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    console.log(profile);

    const index = profile.experience.findIndex(
      (experience) => experience._id == expId
    );

    profile.experience.splice(index, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

const educationValidations = [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
  check('to', 'To date is required').not().isEmpty(),
];

router.put('/education', auth, educationValidations, async (req, res) => {
  const { school, degree, fieldofstudy, from, to, current, decription } =
    req.body;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    const education = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      decription,
    };

    profile.education.unshift(education);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.delete('/education/:eduId', auth, async (req, res) => {
  const { eduId } = req.params;
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found for the user' });
    }

    const index = profile.education.findIndex((item) => item._id == eduId);
    profile.education.splice(index, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/github/:userName', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.userName
      }/repos?per_page=5&
      sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js',
      },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
