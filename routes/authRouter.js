const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const configData = require('../src/config/config.js');

// Render authentication page
router.get('/', (req, res) => {
  res.render("auth");
});

// Register new user
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const prevUser = await userModel.findOne({ email });
    if (prevUser) {
      return res.status(400).redirect('/error?code=400&message=Email Already Exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      email,
      password: hash,
      username
    });

    await newUser.save();
    res.redirect('/auth');
  } catch (err) {
    res.status(400).redirect('/error?code=400&message=Internal Server Error');
    return ;
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).redirect('/error?code=400&message=Incorrect auth creadentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ username: user.username }, configData.JWT_SECRET);
      res.cookie("token", token);
      res.redirect('/user');
    } else {
      res.status(400).redirect('/error?code=400&message=Incorrect auth creadentials');
      return ;
    }
  } catch (err) {
    res.status(400).redirect('/error?code=400&message=Internal Server Error');
    return ;
  }
});

module.exports = router;