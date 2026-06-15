import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const initGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY not set");
    return;
  }
  // LangChain GOOGLE_API_KEY env var set karo runtime pe
  process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
};

const getGeminiModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set in .env");
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY, // explicitly pass karo
    maxOutputTokens: 1024,
    temperature: 0.7,
  });
};

export { initGemini, getGeminiModel };