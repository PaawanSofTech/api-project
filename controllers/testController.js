const Domain = require('../models/Domain'); // Import Domain model
const TestAttempt = require("../models/TestAttempt"); // ✅ Correct the path if needed
const Question = require("../models/Question"); // ✅ Correct the path if needed

// Fetch subjects based on domain
exports.getSubjectsByDomain = async (req, res) => {
    try {
        const { domain } = req.params;

        // Find domain and return its subjects
        const domainData = await Domain.findOne({ name: domain }).populate('subjects');

        if (!domainData) {
            return res.status(404).json({ message: 'Domain not found' });
        }

        res.status(200).json({ subjects: domainData.subjects });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getTestQuestions = async (req, res) => {
    try {
        const { userId, subject, chapter, topic, domain, limit } = req.query;
        
        if (!userId || !subject || !chapter || !topic || !domain || !limit) {
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        // Find attempted questions by this user for the given subject/chapter/topic
        const previousAttempts = await TestAttempt.findOne({ userId });

        const attemptedQuestionIds = previousAttempts 
            ? previousAttempts.answers.map(a => a.questionId.toString()) 
            : [];

        // Fetch new (unattempted) questions first
        let newQuestions = await Question.find({
            subject,
            chapter,
            topic,
            course: domain,
            _id: { $nin: attemptedQuestionIds }, // Exclude previously attempted questions
        }).limit(parseInt(limit));

        // If not enough new questions, fetch previously attempted ones
        if (newQuestions.length < limit) {
            const remaining = limit - newQuestions.length;
            const oldQuestions = await Question.find({
                subject,
                chapter,
                topic,
                course: domain,
                _id: { $in: attemptedQuestionIds }, // Include only attempted questions
            }).limit(remaining);

            newQuestions = [...newQuestions, ...oldQuestions];
        }

        res.status(200).json(newQuestions);
    } catch (error) {
        console.error("Error fetching test questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};