const mongoose = require("mongoose");

const BehavioralQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  category: { type: String, enum: ["teamwork", "leadership", "conflict", "motivation"], default: "teamwork" },
  sampleAnswer: String,
  aiFeedback: String, // AI-generated feedback later
});

module.exports = mongoose.model("BehavioralQuestion", BehavioralQuestionSchema);
