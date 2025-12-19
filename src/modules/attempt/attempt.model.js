const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
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

  answers: [
    {
      questionIndex: Number,
      answer: String
    }
  ],

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    required: true
  },

  submitted: {
    type: Boolean,
    default: false
  },
  violations: {
  type: Number,
  default: 0
},

autoSubmitted: {
  type: Boolean,
  default: false
}

});

module.exports = mongoose.model("Attempt", attemptSchema);
