const express = require("express");
const router = express.Router();
const paperController = require("../controllers/paperController");

// ✅ Get Distinct Chapters Based on Course & Subject
router.get("/chapters/:course/:subject", paperController.getDistinctChapters);

// ✅ Get Distinct Topics Based on Course, Subject & Chapter
router.get("/topics/:course/:subject/:chapter", paperController.getDistinctTopics);

// ✅ Count Questions Based on Domain & Subject
router.get("/count/:domain/:subject", paperController.countQuestionsByDomainAndSubject);

// ✅ Count Questions Based on Domain, Subject & Chapter
router.get("/count/:domain/:subject/:chapter", paperController.countQuestionsByDomainSubjectChapter);

// ✅ Count Questions Based on Domain, Subject, Chapter & Topic
router.get("/count/:domain/:subject/:chapter/:topic", paperController.countQuestionsByDomainSubjectChapterTopic);

module.exports = router;
