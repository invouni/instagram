const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    default: ""
  },
  profile: {
    type: String,
    default: ""
  },
  email: {
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  likeCount: {
    type: Number,
    default: 0
  },
  reels: {
    type: Array,
    default: [],
    required: false,
    unique: false
  },
  posts: {
    type: Array,
    default: [],
    required: false,
    unique: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
