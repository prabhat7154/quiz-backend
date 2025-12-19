const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },

  amount: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true
  },

  description: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("WalletTransaction", walletSchema);
