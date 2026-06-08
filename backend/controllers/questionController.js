const Question = require("../models/Question");

// Add new question
exports.addQuestion = async (req, res) => {
  try {
    const { questionText, category, difficulty, answer } = req.body;
    const question = new Question({ questionText, category, difficulty, answer });
    await question.save();
    res.status(201).json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
