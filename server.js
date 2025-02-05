const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const libraryRoutes = require('./routes/LibraryRoutes');
const postRoutes = require('./routes/PostRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const domainRoutes = require("./routes/domainRoutes");
const paperRoutes = require("./routes/paperRoutes");



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
app.use('/api/feedback', feedbackRoutes); 
app.use('/api/domain', domainRoutes);
app.use("/api/paper", paperRoutes);

// const Question = require("./models/Question");

// async function cleanData() {
//     try {
//       const questions = await Question.find({});
      
//       for (let question of questions) {
//         question.course = question.course.trim();
//         question.subject = question.subject.trim();
//         question.chapter = question.chapter.trim();
//         question.topic = question.topic.trim();
//         await question.save();
//       }
  
//       console.log("Data cleaned successfully!");
//     } catch (error) {
//       console.error("Error cleaning data:", error);
//     }
//   }
  
//   cleanData();

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
