const express = require("express");
const { getChaptersBySubject } = require("../controllers/subjectController");

const router = express.Router();

// Route for fetching chapters based on subject
router.get("/chapters/:subject", getChaptersBySubject);

module.exports = router;
