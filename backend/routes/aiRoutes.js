
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  generateAIQuestion,
  evaluateInterview
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateAIQuestion);

router.post(
  "/evaluate",
  protect,
  evaluateInterview
);

export default router;