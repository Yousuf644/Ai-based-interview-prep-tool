const express = require("express");
const router = express.Router();
const Question = require("../models/questionModel");

// POST - Add a new question
router.post("/", async (req, res) => {
  try {
    const { type, question, answer } = req.body;
    if (!type || !question || !answer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuestion = new Question({ type, question, answer });
    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

module.exports = router;
