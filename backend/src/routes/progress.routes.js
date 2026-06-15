import { Router } from "express";
import { getProgress } from "../controllers/progress.controller.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.use(protect); // All progress routes require login

router.get("/", getProgress); // Get full progress data

export default router;
