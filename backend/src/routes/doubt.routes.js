import { Router } from "express";
import { createSession, askDoubt, getAllSessions, getSession, resolveSession, deleteSession } from "../controllers/doubt.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.use(protect);

router.post("/session", createSession);
router.post("/ask/:sessionId", upload.single("image"), askDoubt);
router.get("/sessions", getAllSessions);
router.get("/session/:id", getSession);
router.patch("/session/:id/resolve", resolveSession);
router.delete("/session/:id", deleteSession);

export default router;
