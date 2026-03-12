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

    // System instruction for the mental health chatbot (will be prepended to first message)
    const systemInstruction = "You are Serene, a compassionate mental health support chatbot. You provide empathetic listening, emotional support, simple mindfulness and breathing exercises, stress management tips, and positive affirmations. Keep responses short (2-3 sentences), calm, and encouraging. If the user mentions serious mental health issues, gently suggest seeking professional help.";

    // Create model WITHOUT system instruction (Gemma doesn't support it)
    // Using gemini-2.5-flash which supports systemInstruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    // Build chat history in the new format
    // IMPORTANT: Gemini requires history to start with 'user' role, not 'model'
    const history = [];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      // Get recent messages (last 10)
      let recentMessages = conversationHistory.slice(-10);
      
      // Filter: only include messages AFTER the first user message
      // This removes the initial bot greeting
      let foundFirstUser = false;
      
      for (const msg of recentMessages) {
        if (msg.from === 'user') {
          foundFirstUser = true;
        }
        
        // Only add to history after we've found the first user message
        if (foundFirstUser) {
          history.push({
            role: msg.from === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }
      
      // If history still starts with model, remove leading model messages
      while (history.length > 0 && history[0].role === 'model') {
        history.shift();
      }
    }

    console.log('Processed history length:', history.length);
    console.log('History roles:', history.map(h => h.role));

    // Start chat session
    const chat = model.startChat({
      history,
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