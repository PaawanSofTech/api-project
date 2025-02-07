const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
  testId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test', 
    required: true 
  }, // Reference to the Test

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User

  title: { 
    type: String, 
    required: true 
  }, // Title of the test

  type: {
    type: String,
    enum: ['mcq', 'numerical', 'both'], // Test can be of type MCQ, Numerical, or Both
    required: true
  },

  timeBound: { 
    type: Number, 
    required: true,
    min: 1 // Time bound in minutes (must be at least 1 minute)
  }, // Time limit for the test in minutes

  totalQuestions: { 
    type: Number, 
    required: true,
    min: 1 // The total number of questions in the test
  }, // Total number of questions in the test

  totalMarks: { 
    type: Number, 
    required: true,
    min: 1 // The total marks the test is worth
  }, // Total marks for the test

  answers: [
    {
      questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
      }, // Question ID

      course: { 
        type: String, 
        required: [true, 'Course is required'] 
      }, // Course

      subject: { 
        type: String, 
        required: [true, 'Subject is required'] 
      }, // Subject

      topic: { 
        type: String, 
        required: [true, 'Topic is required'] 
      }, // Topic

      chapter: { 
        type: String, 
        required: [true, 'Chapter is required'] 
      }, // Chapter

      questionContent: { 
        type: String, 
        required: [true, 'Question content is required'] 
      }, // Question content

      solutionContent: { 
        type: String, 
        required: [true, 'Solution content is required'] 
      }, // Solution content

      correctOption: { 
        type: String, 
        required: [true, 'Correct option is required'] 
      }, // Correct option

      questionType: { 
        type: String, 
        enum: ["MCQ", "Numerical"], 
        default: "MCQ" 
      }, // Question type (MCQ or Numerical)

      selectedAnswer: { 
        type: String 
      }, // User's selected answer (MCQ or Numerical)

      status: {
        type: Number,
        enum: [-1, 0, 1, 2, 3, 4], // -1=Unviewed, 0=Viewed, 1=Answered, 2=Skipped, 3=Reviewed, 4=ReviewedAndSubmitted
        default: -1, // Default status is Unviewed (-1)
      }
    }
  ],

  testStatus: {
    type: Number,
    enum: [0, 1], // 0=Not Completed, 1=Completed
    default: 0, // Default status is Not Completed (0)
  },

  viewSolution: {  
    type: Number,  
    enum: [0, 1], // 0=No Solution, 1=Solution Available
    default: 0 // Default is no solution
  }, // If the test is completed or not

  marks: { 
    type: Number, 
    default: 0 
  }, // Marks scored by the user

  percentage: { 
    type: Number, 
    default: 0 
  }, // Percentage of correct answers

  timeTaken: { 
    type: Number, 
    default: 0 
  }, // Time taken in seconds

  startTime: { 
    type: Date, 
    default: null 
  }, // When the test started

  endTime: { 
    type: Date, 
    default: null 
  }, // When the test ended
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);