import { Router } from "express";
import {
  createSession,
  askDoubt,
  getAllSessions,
  getSession,
  resolveSession,
} from "../controllers/doubt.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// All doubt routes require authentication
router.use(protect);

router.post("/session", createSession); // Create new session
router.post("/ask/:sessionId", upload.single("image"), askDoubt); // Ask a doubt (with optional image)
router.get("/sessions", getAllSessions); // Get all sessions
router.get("/session/:id", getSession); // Get single session
router.patch("/session/:id/resolve", resolveSession); // Mark as resolved

export default router;
