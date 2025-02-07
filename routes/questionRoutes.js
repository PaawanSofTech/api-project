const express = require("express");
const { getQuestionCount } = require("../controllers/questionController");

const router = express.Router();

// Route to fetch available question count
router.get('/question-count', getQuestionCount);

module.exports = router;
