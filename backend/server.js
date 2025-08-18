const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("./config");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OpenAI setup
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Serve static frontend (index.html lives here)
app.use(express.static(path.join(__dirname, "public")));

// API health check
app.get("/health", (req, res) => {
  res.send("ConsciousNet API running ✅");
});

// AI endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: question }],
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});