import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import doubtRoutes from "./routes/doubt.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

// Import error handler
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Security headers
app.use(helmet());

// CORS - allow frontend to call backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Request logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parse JSON body (max 10mb for image data)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting - max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api", limiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "ExamMind API is running 🚀" });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doubt", doubtRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/upload", uploadRoutes);

// 404 handler - route not found
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
