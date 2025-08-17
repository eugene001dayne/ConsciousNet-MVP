const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("./config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OpenAI config (new SDK)
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Health check
app.get("/health", (req, res) => {
  res.send("ConsciousNet API running ✅");
});

// Ask endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // cheaper/faster model for now
      messages: [{ role: "user", content: question }],
    });

    res.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server (important for Render!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});