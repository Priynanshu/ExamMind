import multer from "multer";
import { ApiError } from "../utils/apiError.js";

// Store file in memory (buffer) before uploading to ImageKit
const storage = multer.memoryStorage();

// Filter - only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept file
  } else {
    cb(new ApiError(400, "Only image files are allowed"), false);
  }
};

// Max file size: 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload };
