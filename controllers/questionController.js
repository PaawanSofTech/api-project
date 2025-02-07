const Question = require('../models/Question'); // Import Question model

// Fetch available question count based on subject, chapter, topic, and domain
exports.getQuestionCount = async (req, res) => {
    try {
        const { subject, chapter, topic, domain } = req.query; // Get filters from query params

        // Build dynamic query object based on available filters
        let query = {};
        if (subject) query.subject = subject;
        if (chapter) query.chapter = chapter;
        if (topic) query.topic = topic;
        if (domain) query.course = domain; // Assuming 'course' represents the domain

        // Count the matching questions
        const questionCount = await Question.countDocuments(query);

        res.status(200).json({
            subject,
            chapter,
            topic,
            domain,
            questionCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
