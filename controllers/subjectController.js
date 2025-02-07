const Question = require("../models/Question");

// Fetch unique chapters based on the subject
const getChaptersBySubject = async (req, res) => {
    try {
        const { subject } = req.params;

        // Find distinct chapters where subject matches
        const chapters = await Question.distinct("chapter", { subject });

        if (!chapters.length) {
            return res.status(404).json({ message: "No chapters found for this subject" });
        }

        res.json({ chapters });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getChaptersBySubject };

