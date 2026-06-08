import express from "express";
import { generateAIQuestion } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateAIQuestion);

export default router;
