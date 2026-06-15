import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Generate a JWT token for a user
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new student
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered. Please login.");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    profile: profile || {}, // Optional profile setup during registration
  });

  // Generate token
  const token = generateToken(user._id);

  // Send response (exclude password)
  return res.status(201).json(
    new ApiResponse(201, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        streak: user.streak,
        totalDoubts: user.totalDoubts,
        badges: user.badges,
      },
      token,
    }, "Account created successfully! Welcome to ExamMind 🎉")
  );
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a student
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if password matches
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        streak: user.streak,
        totalDoubts: user.totalDoubts,
        badges: user.badges,
      },
      token,
    }, `Welcome back, ${user.name}! 👋`)
  );
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged-in user
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const user = await User.findById(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, { user }, "User fetched successfully")
  );
});

/**
 * @route   PUT /api/v1/auth/update-profile
 * @desc    Update student academic profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { profile, name } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name && { name }),
      ...(profile && { profile }),
    },
    { new: true, runValidators: true } // Return updated document
  );

  return res.status(200).json(
    new ApiResponse(200, { user: updatedUser }, "Profile updated successfully!")
  );
});

export { register, login, getMe, updateProfile };
