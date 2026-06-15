import { getImageKit } from "../config/imagekit.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Upload an image buffer to ImageKit cloud storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} fileName - Name for the uploaded file
 * @param {String} folder - ImageKit folder path
 * @returns {Object} - { url, fileId }
 */
const uploadImage = async (fileBuffer, fileName, folder = "/examind/doubts") => {
  const imagekit = getImageKit();

  if (!imagekit) {
    throw new ApiError(503, "Image upload service not available");
  }

  try {
    const response = await imagekit.upload({
      file: fileBuffer, // Buffer
      fileName: `${Date.now()}_${fileName}`,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    throw new ApiError(500, `Image upload failed: ${error.message}`);
  }
};

/**
 * Delete an image from ImageKit by fileId
 */
const deleteImage = async (fileId) => {
  const imagekit = getImageKit();
  if (!imagekit) return;

  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error.message);
  }
};

export { uploadImage, deleteImage };
