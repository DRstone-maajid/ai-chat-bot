const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const START_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT_ATTEMPTS = 20;
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const RAW_MODEL = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";
const MODEL = RAW_MODEL.startsWith("models/")
  ? RAW_MODEL.replace(/^models\//, "")
  : RAW_MODEL;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    if (!GOOGLE_AI_API_KEY) {
      return res.status(500).json({
        error: "Missing GOOGLE_AI_API_KEY in environment variables."
      });
    }

    const userMessage = req.body?.message?.toString().trim();
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      const apiError = data?.error?.message || "Google AI API request failed.";
      return res.status(response.status).json({ error: apiError });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not generate a reply.";

    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: `Server error while processing chat request: ${error.message}`
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function startServer(port, attemptsLeft) {
  const server = app.listen(port, () => {
    console.log(`k.vm.s s chatbot running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.log(`Port ${port} is busy. Trying ${nextPort}...`);
      startServer(nextPort, attemptsLeft - 1);
      return;
    }

    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

startServer(START_PORT, MAX_PORT_ATTEMPTS);
