import { uploadImage } from "../services/imagekitService.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @route   POST /api/v1/upload/image
 * @desc    Upload an image to ImageKit and return the URL
 */
const uploadImageController = asyncHandler(async (req, res) => {
  // req.file is set by multer middleware
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const { url, fileId } = await uploadImage(
    req.file.buffer,
    req.file.originalname,
    "/examind/doubts"
  );

  return res.status(200).json(
    new ApiResponse(200, { url, fileId }, "Image uploaded successfully")
  );
});

export { uploadImageController };
