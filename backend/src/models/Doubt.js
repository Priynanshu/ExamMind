import mongoose from "mongoose";

// Individual message inside a doubt session (student or AI)
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null, // URL of uploaded question image if any
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Doubt session - one session per topic/question a student asks about
const doubtSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Doubt", // Auto-generated from first message
    },
    subject: {
      type: String,
      default: "General",
    },
    messages: [messageSchema], // All messages in this session
    isResolved: {
      type: Boolean,
      default: false,
    },
    // Snapshot of student profile at time of doubt (for personalized AI)
    studentContext: {
      educationLevel: String,
      stream: String,
      language: String,
    },
  },
  { timestamps: true }
);

const Doubt = mongoose.model("Doubt", doubtSchema);
export default Doubt;
