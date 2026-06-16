import Doubt from "../models/Doubt.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { askGemini, generateDoubtTitle } from "../services/geminiService.js";
import { uploadImage } from "../services/imagekitService.js";

const createSession = asyncHandler(async (req, res) => {
  const { subject } = req.body;
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
  return res.status(201).json(new ApiResponse(201, { session }, "Session created"));
});

const askDoubt = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  const session = await Doubt.findOne({ _id: sessionId, user: req.user._id });
  if (!session) throw new ApiError(404, "Session not found");

  let imageUrl = null;
  if (req.file) {
    const uploaded = await uploadImage(req.file.buffer, req.file.originalname);
    imageUrl = uploaded.url;
  }

  const userMessage = { role: "user", content: message || "Please help me with this image.", imageUrl };
  session.messages.push(userMessage);

  const chatHistory = session.messages.map((msg) => ({ role: msg.role, content: msg.content }));
  const imageBase64 = req.file ? req.file.buffer.toString("base64") : null;
  const aiResponseText = await askGemini(chatHistory, session.studentContext, session.subject, imageBase64);

  const aiMessage = { role: "ai", content: aiResponseText };
  session.messages.push(aiMessage);

  if (session.messages.length === 2 && session.title === "Untitled Doubt") {
    session.title = await generateDoubtTitle(message);
  }

  await session.save();

  if (session.messages.length === 2) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalDoubts: 1 } });
    await updateUserStreak(req.user._id);
  }

  return res.status(200).json(new ApiResponse(200, { userMessage, aiMessage, sessionId: session._id, title: session.title }, "Response generated"));
});

const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActive = user.streak.lastActiveDate ? new Date(user.streak.lastActiveDate) : null;
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return;
    user.streak.current = diffDays === 1 ? user.streak.current + 1 : 1;
  } else {
    user.streak.current = 1;
  }
  if (user.streak.current > user.streak.longest) user.streak.longest = user.streak.current;
  user.streak.lastActiveDate = today;
  await user.save();
};

const getAllSessions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, subject } = req.query;
  const filter = { user: req.user._id };
  if (subject) filter.subject = subject;
  const sessions = await Doubt.find(filter).select("-messages").sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
  const total = await Doubt.countDocuments(filter);
  return res.status(200).json(new ApiResponse(200, { sessions, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } }, "Sessions fetched"));
});

const getSession = asyncHandler(async (req, res) => {
  const session = await Doubt.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new ApiError(404, "Session not found");
  return res.status(200).json(new ApiResponse(200, { session }, "Session fetched"));
});

const resolveSession = asyncHandler(async (req, res) => {
  const session = await Doubt.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isResolved: true },
    { new: true }
  );
  if (!session) throw new ApiError(404, "Session not found");
  return res.status(200).json(new ApiResponse(200, { session }, "Doubt marked as resolved!"));
});

const deleteSession = asyncHandler(async (req, res) => {
  const session = await Doubt.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!session) throw new ApiError(404, "Session not found");
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalDoubts: -1 } });
  return res.status(200).json(new ApiResponse(200, { deletedId: req.params.id }, "Session deleted"));
});

export { createSession, askDoubt, getAllSessions, getSession, resolveSession, deleteSession };
