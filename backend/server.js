import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();

// ==========================
// Database Connection
// ==========================
connectDB();

/// ==========================
// Path Setup
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// Static Frontend Files
// ==========================
app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

// ==========================
// Home Route
// ==========================
app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../frontend/dashboard.html"
    )
  );
});
// ==========================
// Middleware
// ==========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://ai-based-interview-prep-tool.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ==========================
// Static Frontend Files
// ==========================

// ==========================
// Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interviews", interviewRoutes);

// ==========================

// ==========================
// Server Start
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});