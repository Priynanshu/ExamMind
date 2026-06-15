import dotenv from "dotenv";
dotenv.config(); // Load .env variables first

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.js";
import { initGemini } from "./src/config/gemini.js";
import { initImageKit } from "./src/config/imagekit.js";

const PORT = process.env.PORT || 5000;

// Start server after all connections are established
const startServer = async () => {
  try {
    await connectDB();       // Connect MongoDB
    await connectRedis();    // Connect Redis (non-fatal if fails)
    initGemini();            // Initialize Gemini AI
    initImageKit();          // Initialize ImageKit

    app.listen(PORT, () => {
      console.log(`ExamMind Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
