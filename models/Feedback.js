const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  reason: { type: String, required: true },
  feedback: { type: String, required: true },
  dateTime: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
