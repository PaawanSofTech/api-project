const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have the User model

// Mark paper as viewed
const markPaperViewed = async (req, res) => {
    const { userID, paperID } = req.body;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the paper in the user's papers array
        const paper = user.papers.find(p => p.paperID === paperID);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found for this user' });
        }

        // Set the "viewed" bit (bit 0)
        paper.status |= 1;  // Binary OR operation to set bit 0
        paper.viewedAt = new Date();

        await user.save();
        return res.status(200).json({ message: 'Paper viewed successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Mark paper as started
const markPaperStarted = async (req, res) => {
    const { userID, paperID } = req.body;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the paper in the user's papers array
        const paper = user.papers.find(p => p.paperID === paperID);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found for this user' });
        }

        // Set the "started" bit (bit 1)
        paper.status |= 2;  // Binary OR operation to set bit 1
        paper.startedAt = new Date();

        await user.save();
        return res.status(200).json({ message: 'Paper started successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Mark paper as completed
const markPaperCompleted = async (req, res) => {
    const { userID, paperID, score } = req.body;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the paper in the user's papers array
        const paper = user.papers.find(p => p.paperID === paperID);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found for this user' });
        }

        // Set the "completed" bit (bit 2)
        paper.status |= 4;  // Binary OR operation to set bit 2
        paper.score = score;
        paper.completedAt = new Date();

        await user.save();
        return res.status(200).json({ message: 'Paper completed successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Mark paper as abandoned
const markPaperAbandoned = async (req, res) => {
    const { userID, paperID } = req.body;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the paper in the user's papers array
        const paper = user.papers.find(p => p.paperID === paperID);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found for this user' });
        }

        // Set the "abandoned" bit (bit 3)
        paper.status |= 8;  // Binary OR operation to set bit 3

        await user.save();
        return res.status(200).json({ message: 'Paper abandoned successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Fetch paper status by userID and paperID
const fetchPaperStatus = async (req, res) => {
    const { userID, paperID } = req.params;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the paper in the user's papers array
        const paper = user.papers.find(p => p.paperID === paperID);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found for this user' });
        }

        // Decode the binary status
        const status = paper.status;
        const statusMessages = {
            viewed: (status & 1) !== 0,
            started: (status & 2) !== 0,
            completed: (status & 4) !== 0,
            abandoned: (status & 8) !== 0,
        };

        return res.status(200).json({
            paperID: paper.paperID,
            status: statusMessages,
            score: paper.score,
            viewedAt: paper.viewedAt,
            startedAt: paper.startedAt,
            completedAt: paper.completedAt,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    markPaperViewed,
    markPaperStarted,
    markPaperCompleted,
    markPaperAbandoned,
    fetchPaperStatus,
};
