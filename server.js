const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const paperRoutes = require('./routes/paperRoutes');
const libraryRoutes = require('./routes/LibraryRoutes');
const postRoutes = require('./routes/PostRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); // Import the feedback routes

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Use express built-in JSON parser

// Routes
app.use('/api/users', userRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/library', libraryRoutes); 
app.use('/api/posts', postRoutes); 
app.use('/api/feedback', feedbackRoutes); // Feedback routes

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process on failure
  }
};

connectDB();

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
