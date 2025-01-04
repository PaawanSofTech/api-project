const express = require('express');
const router = express.Router();
const {
  markPaperViewed,
  markPaperStarted,
  markPaperCompleted,
  markPaperAbandoned,
  fetchPaperStatus
} = require('../controllers/paperController');

// Routes for paper status updates
router.post('/paper-viewed', markPaperViewed);
router.post('/paper-started', markPaperStarted);
router.post('/paper-completed', markPaperCompleted);
router.post('/paper-abandoned', markPaperAbandoned);

// Route to fetch paper status
router.get('/paper-status/:userID/:paperID', fetchPaperStatus);

module.exports = router;
