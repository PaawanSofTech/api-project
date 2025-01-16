const Feedback = require('../models/Feedback');  // Import the Feedback model

exports.createFeedback = async (req, res) => {
  const { userId, reason, feedback } = req.body;

  try {
    // Validate the incoming data
    if (!userId || !reason || !feedback) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    
    // Create a new feedback document
    const newFeedback = new Feedback({
      userId,
      reason,
      feedback,
      dateTime: new Date(),  // Capture the current date and time
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Return a success response
    return res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      message: 'Server error while submitting feedback. Please try again later.',
      error: error.message,
    });
  }
};


// Controller method to handle fetching all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    // Fetch all feedback records from the database
    const feedbacks = await Feedback.find();

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedback found.' });
    }

    // Return the feedback data
    return res.status(200).json({
      message: 'Feedback fetched successfully',
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({
      message: 'Server error while fetching feedback. Please try again later.',
      error: error.message,
    });
  }
};
