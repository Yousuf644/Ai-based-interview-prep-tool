const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema({
  username: { type: String, required: true },
  attemptedQuestions: Number,
  correctAnswers: Number,
  accuracy: Number,
  lastActive: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserProgress", UserProgressSchema);
