import Doubt from "../models/Doubt.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { askGemini, generateDoubtTitle } from "../services/geminiService.js";
import { uploadImage } from "../services/imagekitService.js";

/**
 * @route   POST /api/v1/doubt/session
 * @desc    Create a new doubt session
 */
const createSession = asyncHandler(async (req, res) => {
  const { subject } = req.body;

  // Create empty session - messages will be added via /ask
  const session = await Doubt.create({
    user: req.user._id,
    subject: subject || "General",
    studentContext: {
      educationLevel: req.user.profile.educationLevel,
      stream: req.user.profile.stream,
      language: req.user.profile.language,
    },
    messages: [],
  });

  return res.status(201).json(
    new ApiResponse(201, { session }, "Session created")
  );
});

/**
 * @route   POST /api/v1/doubt/ask/:sessionId
 * @desc    Send a message in a doubt session and get AI response
 */
const askDoubt = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  // Find the session and verify it belongs to this user
  const session = await Doubt.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  let imageUrl = null;

  // Handle image upload if file was sent
  if (req.file) {
    const uploaded = await uploadImage(req.file.buffer, req.file.originalname);
    imageUrl = uploaded.url;
  }

  // Add student's message to session
  const userMessage = {
    role: "user",
    content: message || "Please help me with this image.",
    imageUrl,
  };
  session.messages.push(userMessage);

  // Build chat history in simple {role, content} format for LangChain
// Include ALL messages including the new user message at the end
const chatHistory = session.messages.map((msg) => ({
  role: msg.role,       // "user" or "ai"
  content: msg.content, // plain text
}));

const imageBase64 = req.file ? req.file.buffer.toString("base64") : null;
const aiResponseText = await askGemini(
  chatHistory,
  session.studentContext,
  session.subject,
  imageBase64
);

  // Add AI response to session
  const aiMessage = {
    role: "ai",
    content: aiResponseText,
  };
  session.messages.push(aiMessage);

  // Generate title from first message if session is new
  if (session.messages.length === 2 && session.title === "Untitled Doubt") {
    session.title = await generateDoubtTitle(message);
  }

  await session.save();

  // Update user stats
  if (session.messages.length === 2) {
    // First doubt in this session
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDoubts: 1 }, // Increment total doubts count
    });

    // Update streak
    await updateUserStreak(req.user._id);
  }

  return res.status(200).json(
    new ApiResponse(200, {
      userMessage,
      aiMessage,
      sessionId: session._id,
      title: session.title,
    }, "Response generated")
  );
});

/**
 * Helper to update user's daily streak
 */
const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.streak.lastActiveDate
    ? new Date(user.streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return; // Already active today
    if (diffDays === 1) {
      // Consecutive day - increase streak
      user.streak.current += 1;
    } else {
      // Streak broken
      user.streak.current = 1;
    }
  } else {
    user.streak.current = 1; // First time
  }

  // Update longest streak record
  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current;
  }

  user.streak.lastActiveDate = today;
  await user.save();
};

/**
 * @route   GET /api/v1/doubt/sessions
 * @desc    Get all doubt sessions for logged in user
 */
const getAllSessions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, subject } = req.query;

  // Build filter
  const filter = { user: req.user._id };
  if (subject) filter.subject = subject;

  const sessions = await Doubt.find(filter)
    .select("-messages") // Don't send all messages, just metadata
    .sort({ createdAt: -1 }) // Newest first
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Doubt.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      sessions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    }, "Sessions fetched")
  );
});

/**
 * @route   GET /api/v1/doubt/session/:id
 * @desc    Get a single doubt session with all messages
 */
const getSession = asyncHandler(async (req, res) => {
  const session = await Doubt.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { session }, "Session fetched")
  );
});

/**
 * @route   PATCH /api/v1/doubt/session/:id/resolve
 * @desc    Mark a session as resolved
 */
const resolveSession = asyncHandler(async (req, res) => {
  const session = await Doubt.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isResolved: true },
    { new: true }
  );

  if (!session) throw new ApiError(404, "Session not found");

  return res.status(200).json(
    new ApiResponse(200, { session }, "Great job! Doubt marked as resolved! 🎉")
  );
});

export { createSession, askDoubt, getAllSessions, getSession, resolveSession };
