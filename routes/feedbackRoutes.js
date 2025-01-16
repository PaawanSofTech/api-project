const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to handle submitting feedback (POST)
router.post('/', feedbackController.createFeedback);

// Route to handle fetching all feedback (GET)
router.get('/', feedbackController.getAllFeedback);

module.exports = router;
