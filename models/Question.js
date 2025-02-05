const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    quesID: { type: String, unique: true },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true // ✅ Trim extra spaces
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true // ✅ Trim extra spaces
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true // ✅ Trim extra spaces
    },
    chapter: {
      type: String,
      required: [true, 'Chapter is required'],
      trim: true // ✅ Trim extra spaces
    },
    tags: String,
    questionContent: {
      type: String,
      required: [true, 'Question content is required'],
      trim: true
    },
    solutionContent: {
      type: String,
      required: [true, 'Solution content is required'],
      trim: true
    },
    correctOption: {
      type: String,
      required: [true, 'Correct option is required'],
      trim: true
    },
    questionType: {
      type: String,
      enum: ["MCQ", "Numerical"],
      default: "MCQ",
      required: [true, 'Question type is required']
    },
    startingRange: {
      type: String,
      required: function() { return this.questionType === 'Numerical'; }
    },
    endingRange: {
      type: String,
      required: function() { return this.questionType === 'Numerical'; }
    }
});

// ✅ Pre-save middleware to remove extra spaces
questionSchema.pre('save', function (next) {
    this.course = this.course.trim();
    this.subject = this.subject.trim();
    this.chapter = this.chapter.trim();
    this.topic = this.topic.trim();
    next();
});

module.exports = mongoose.model('Question', questionSchema);
