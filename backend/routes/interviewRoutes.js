import express from "express";
import Interview from "../models/Interview.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all interviews
router.get("/", protect, async (req, res) => {
  try {
    const interviews =
  await Interview.find({
    user: req.user._id
  })
      .sort({ createdAt: -1 });

    res.json(interviews);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interviews"
    });
  }
});

// Analytics
router.get("/analytics", protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id });

    const totalInterviews = interviews.length;

    if (totalInterviews === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        latestScore: 0
      });
    }

    const averageScore = Math.round(
      interviews.reduce(
        (sum, item) => sum + item.score,
        0
      ) / totalInterviews
    );

    const bestScore = Math.max(
      ...interviews.map(i => i.score)
    );

    const latestScore = interviews.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )[0].score;

    res.json({
      totalInterviews,
      averageScore,
      bestScore,
      latestScore
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Analytics failed"
    });
  }
});
router.get("/:id", protect, async (req, res) => {
  try {

    const interview =
      await Interview.findOne({
  _id: req.params.id,
  user: req.user._id
});
    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    res.json(interview);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch interview"
    });

  }
});
router.delete("/:id", protect, async (req, res) => {
  try {
   const interview = await Interview.findById(
  req.params.id
);
    if (!interview) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;