import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

    role: String,
    level: String,
    skills: [String],

    score: Number,
    label: String,
    description: String,
    improvement: String,

    answered: [
      {
        q: String,
        a: String
      }
    ],

    feedback: [
      {
        qnum: Number,
        rating: Number,
        strength: String,
        weakness: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);