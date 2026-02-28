require("dotenv").config();

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const RAW_MODEL = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";
const MODEL = RAW_MODEL.startsWith("models/")
  ? RAW_MODEL.replace(/^models\//, "")
  : RAW_MODEL;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }]
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

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: `Server error while processing chat request: ${error.message}`
    });
  }
};
