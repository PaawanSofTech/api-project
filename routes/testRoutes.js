const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// Route to fetch subjects based on domain
router.get('/subjects/:domain', testController.getSubjectsByDomain);

router.get("/fetch-questions", testController.getTestQuestions);

module.exports = router;
