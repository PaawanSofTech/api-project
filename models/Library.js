const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  pdf: {
    type: String, // Base64 encoded PDF
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Library', librarySchema);
