import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

// Middleware to protect routes - checks if user is logged in
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Please login to access this resource");
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user from token payload
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found, please login again");
  }

  req.user = user; // Attach user to request object
  next();
});

export { protect };
