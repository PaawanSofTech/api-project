const Question = require("../models/Question");


// 1️⃣ Get Distinct Chapters Based on Course & Subject
exports.getDistinctChapters = async (req, res) => {
  try {
    const { course, subject } = req.params;

    if (!course || !subject) {
      return res.status(400).json({ message: "Course and subject are required!" });
    }

    const chapters = await Question.find({ course, subject }).distinct("chapter");

    if (!chapters.length) {
      return res.status(404).json({ message: "No chapters found for the given course and subject!" });
    }

    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 2️⃣ Get Distinct Topics Based on Course, Subject & Chapter
exports.getDistinctTopics = async (req, res) => {
  try {
    const { course, subject, chapter } = req.params;

    if (!course || !subject || !chapter) {
      return res.status(400).json({ message: "Course, subject, and chapter are required!" });
    }

    const topics = await Question.find({ course, subject, chapter }).distinct("topic");

    if (!topics.length) {
      return res.status(404).json({ message: "No topics found for the given course, subject, and chapter!" });
    }

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// 1️⃣ Count Questions Based on Domain & Subject
exports.countQuestionsByDomainAndSubject = async (req, res) => {
    try {
      const { domain, subject } = req.params;
  
      if (!domain || !subject) {
        return res.status(400).json({ message: "Domain and subject are required!" });
      }
  
      const count = await Question.countDocuments({ course: domain, subject });
  
      res.status(200).json({ domain, subject, totalQuestions: count });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  // 2️⃣ Count Questions Based on Domain, Subject & Chapter
  exports.countQuestionsByDomainSubjectChapter = async (req, res) => {
    try {
      const { domain, subject, chapter } = req.params;
  
      if (!domain || !subject || !chapter) {
        return res.status(400).json({ message: "Domain, subject, and chapter are required!" });
      }
  
      const count = await Question.countDocuments({ course: domain, subject, chapter });
  
      res.status(200).json({ domain, subject, chapter, totalQuestions: count });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  // 3️⃣ Count Questions Based on Domain, Subject, Chapter & Topic
  exports.countQuestionsByDomainSubjectChapterTopic = async (req, res) => {
    try {
      const { domain, subject, chapter, topic } = req.params;
  
      if (!domain || !subject || !chapter || !topic) {
        return res.status(400).json({ message: "Domain, subject, chapter, and topic are required!" });
      }
  
      const count = await Question.countDocuments({ course: domain, subject, chapter, topic });
  
      res.status(200).json({ domain, subject, chapter, topic, totalQuestions: count });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };