const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  url: {
    type: String,
    default: "",
    required: true,
    unique: true
  },
  likes: {
    type: Number,
    default: 0,
    required: false,
    unique: false
  },
  username: {
    type: String,
    default: "",
    unique: false,
    required: false
  },
  comments: {
    type: Array,
    default: [],
    required: false,
  }
})

const postModel = mongoose.model('post',postSchema);

module.exports = postModel;