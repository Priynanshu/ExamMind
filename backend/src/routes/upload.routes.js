import { Router } from "express";
import { uploadImageController } from "../controllers/upload.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.use(protect);

// Upload single image
router.post("/image", upload.single("image"), uploadImageController);

export default router;
