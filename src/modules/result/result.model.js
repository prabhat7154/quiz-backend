const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  score: {
    type: Number,
    required: true
  },

  totalQuestions: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  prize: {
  type: Number,
  default: 0
},

rank: {
  type: Number
}

});

module.exports = mongoose.model("Result", resultSchema);
