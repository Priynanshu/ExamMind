import Doubt from "../models/Doubt.js";
import User from "../models/User.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @route   GET /api/v1/progress
 * @desc    Get full progress stats for logged-in student
 */
const getProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all doubt sessions for this user
  const sessions = await Doubt.find({ user: userId });

  // Count doubts per subject
  const subjectCount = {};
  sessions.forEach((session) => {
    const subject = session.subject || "General";
    subjectCount[subject] = (subjectCount[subject] || 0) + 1;
  });

  // Format subject data for chart
  const subjectData = Object.entries(subjectCount).map(([subject, count]) => ({
    subject,
    count,
  }));

  // Get doubts per day (last 7 days) for activity chart
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = sessions.filter((s) => {
      const created = new Date(s.createdAt);
      return created >= date && created < nextDate;
    }).length;

    last7Days.push({
      date: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
      doubts: count,
    });
  }

  // Calculate badges earned
  const user = await User.findById(userId);
  const badges = calculateBadges(user, sessions);

  // Update badges in DB if new ones earned
  if (badges.length > user.badges.length) {
    await User.findByIdAndUpdate(userId, { badges });
  }

  return res.status(200).json(
    new ApiResponse(200, {
      overview: {
        totalDoubts: sessions.length,
        resolvedDoubts: sessions.filter((s) => s.isResolved).length,
        streak: user.streak,
        totalMessages: sessions.reduce((acc, s) => acc + s.messages.length, 0),
      },
      subjectData,
      activityData: last7Days,
      badges,
    }, "Progress fetched")
  );
});

/**
 * Calculate badges based on user activity
 */
const calculateBadges = (user, sessions) => {
  const badges = [];

  if (sessions.length >= 1) badges.push("first_doubt"); // First doubt
  if (sessions.length >= 10) badges.push("curious_mind"); // 10 doubts
  if (sessions.length >= 50) badges.push("knowledge_seeker"); // 50 doubts
  if (user.streak.current >= 3) badges.push("streak_3"); // 3-day streak
  if (user.streak.current >= 7) badges.push("streak_7"); // Week streak
  if (user.streak.longest >= 30) badges.push("streak_30"); // Month streak
  if (sessions.filter((s) => s.isResolved).length >= 5) badges.push("problem_solver"); // 5 resolved

  return badges;
};

export { getProgress };
