import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema - stores student profile and auth info
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    // Student academic profile
    profile: {
      educationLevel: {
        type: String,
        enum: ["class6-8", "class9-10", "class11-12", "college"],
        default: "class9-10",
      },
      stream: {
        type: String,
        enum: ["science-pcm", "science-pcb", "commerce", "arts", "engineering", "medical", "law", "other"],
        default: "science-pcm",
      },
      subjects: [{ type: String }], // e.g. ["Physics", "Maths", "Chemistry"]
      language: {
        type: String,
        enum: ["english", "hinglish"],
        default: "hinglish",
      },
    },
    // Streak tracking
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },
    totalDoubts: { type: Number, default: 0 },
    badges: [{ type: String }], // e.g. ["first_doubt", "streak_7"]
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre("save", async function (next) {
  // Only hash if password was changed
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if entered password matches hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
