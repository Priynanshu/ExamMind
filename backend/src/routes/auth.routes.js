import { Router } from "express";
import { register, login, getMe, updateProfile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

// Public routes (no login needed)
router.post("/register", register);
router.post("/login", login);

// Protected routes (must be logged in)
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);

export default router;
