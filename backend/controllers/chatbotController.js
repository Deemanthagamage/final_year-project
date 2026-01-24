import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export const chatWithBot = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "API key missing",
        hint: "Set GEMINI_API_KEY in your .env file and restart the server",
      });
    }

    // Initialize the new SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    // Recommended current models (as of Jan 2026):
    // - gemini-2.5-flash → best balance of speed & quality (stable)
    // - gemini-2.5-flash-lite → fastest/cheapest
    // - gemini-2.5-pro → more intelligent (if you need deeper responses)
    // - gemini-3-flash-preview → newer, faster preview model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    // System instructions (better way in new SDK)
    const systemInstruction = `
You are Serene, a compassionate mental health support chatbot.
You provide:
- Empathetic listening
- Emotional support
- Simple mindfulness and breathing exercises
- Stress management tips
- Positive affirmations

Keep responses short (2–3 sentences), calm, and encouraging.
If the user mentions serious mental health issues, gently suggest seeking professional help.
    `.trim();

    // Build chat history in the new format
    const history = [];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      // Ensure history starts with 'user' role (Gemini API requirement)
      let recentMessages = conversationHistory.slice(-10);
      
      // Skip initial model messages to ensure we start with 'user'
      let startIdx = 0;
      for (let i = 0; i < recentMessages.length; i++) {
        if (recentMessages[i].from === 'user') {
          startIdx = i;
          break;
        }
      }
      
      recentMessages.slice(startIdx).forEach((msg) => {
        history.push({
          role: msg.from === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      });
    }

    // Start chat session with system instruction
    const chat = model.startChat({
      history,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 180,  // keep short
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    });

    // Send message and get reply
    const result = await chat.sendMessage(message);
    const botReply = result.response.text().trim();

    return res.status(200).json({
      message: "Success",
      reply: botReply,
    });

  } catch (error) {
    console.error("=== CHATBOT ERROR ===");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    console.error("API Key present:", !!process.env.GEMINI_API_KEY);
    console.error("=====================");

    const fallbackReply =
      "I'm here with you. If things feel heavy right now, try taking a slow breath in for 4 seconds, hold for 4, and breathe out gently for 6.";

    return res.status(200).json({
      message: "Fallback",
      reply: fallbackReply,
      error: "AI response failed",
      details: error.message,
      hint: "Ensure @google/generative-ai is installed, GEMINI_API_KEY is set, and model gemini-1.5-flash-latest is available",
    });
  }
};