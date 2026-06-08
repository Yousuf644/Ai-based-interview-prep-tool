const mongoose = require("mongoose");

const CodingQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  topic: { type: String, required: true },
  exampleInput: String,
  exampleOutput: String,
  solution: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
});

module.exports = mongoose.model("CodingQuestion", CodingQuestionSchema);
