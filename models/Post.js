const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Base64 encoded image string
    required: true,
  },
  url: {
    type: String,
    default: null, // URL field with default value as null
  },
  likeCount: {
    type: [String], // Array of user IDs (string format)
    default: [],    // Default to an empty array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);
