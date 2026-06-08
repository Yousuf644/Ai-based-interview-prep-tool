import dotenv from "dotenv";
import Interview from "../models/Interview.js";
dotenv.config();

export const generateAIQuestion = async (req, res) => {
  try {
    const {
  topic,
  difficulty,
  numberOfQuestions
} = req.body;

    const prompt = `
Generate ${numberOfQuestions} ${difficulty}-level interview questions and their detailed answers for the topic: ${topic}.

Return only a valid JSON array.

Return the result as a valid JSON array like:
[
  {"questionText": "Question?", "answer": "Answer."}
]`;

    console.log("🧠 Sending prompt to OpenRouter...");

    // ✅ Direct API request using fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ correct auth
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // ✅ required by OpenRouter
        "X-Title": "Interview Prep Tool",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log("✅ Response received from OpenRouter!");

    // ✅ Clean Markdown formatting before parsing
    let cleanedContent = content
      .replace(/```json/g, "")  // remove opening ```json
      .replace(/```/g, "")      // remove closing ```
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch (err) {
      console.error("⚠️ JSON parsing failed, returning raw content:", err.message);
      parsed = [{ questionText: "Parsing failed", answer: cleanedContent }];
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("❌ AI Generation Error:", error.message);
    res.status(500).json({
      error: "Failed to generate interview questions",
      message: error.message,
    });
  }
};
console.log("🔥 EVALUATE INTERVIEW HIT");
export const evaluateInterview = async (req, res) => {
  try {
      if (!req.user) {
  return res.status(401).json({
    message: "User not found"
  });
}
   const {  role, level, skills, answered } = req.body;
   console.log("User ID:", req.user._id);

    const qa = answered
      .map(
        (a, i) =>
          `Q${i + 1}: ${a.q}\nAnswer: ${a.a}`
      )
      .join("\n\n");

    const prompt = `
Evaluate these interview answers.

Role: ${role}
Level: ${level}
Skills: ${skills.join(", ")}

${qa}

Return valid JSON:
{
  "score": 80,
  "label": "Good Effort",
  "description": "Overall assessment",
  "feedback": [
    {
      "qnum":1,
      "rating":4,
      "strength":"Good answer",
      "weakness":"Needs more examples"
    }
  ],
  "skill_scores":[
    {"skill":"Communication","score":80},
    {"skill":"Technical Depth","score":75},
    {"skill":"Problem Solving","score":70},
    {"skill":"Clarity","score":85}
  ],
  "improvement":"Actionable improvement advice"
}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

   let content =
  data.choices[0].message.content;

content = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("AI RESPONSE:", content);
const start = content.indexOf("{");
const end = content.lastIndexOf("}");

if (start === -1 || end === -1) {
  throw new Error("No JSON found in AI response");
}

const jsonString = content.slice(start, end + 1);

const result = JSON.parse(jsonString);

console.log("REQ USER:", req.user);
console.log("USER ID:", req.user?._id);

if (!result.score || !result.feedback) {
  throw new Error("Invalid AI response");
}

const interview = await Interview.create({
  user: req.user._id,   // ADD THIS LINE

  role,
  level,
  skills,
  score: result.score,
  label: result.label,
  description: result.description,
  improvement: result.improvement,
  answered,
  feedback: result.feedback
});

console.log("SAVED:", interview);
res.json(interview); 

  } catch (error) {
    console.error(error);
    res.status(500).json({
  error: "Evaluation failed",
  message: error.message
});
  }
};