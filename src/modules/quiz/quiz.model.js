const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["MCQ", "FILL"],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String] // MCQ ke liye
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  price: {
    type: Number,
    default: 0
  },

  duration: {
    type: Number, // minutes
    required: true
  },

  startTime: Date,
  endTime: Date,

  questions: [questionSchema],

  registeredStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
}

);

module.exports = mongoose.model("Quiz", quizSchema);
