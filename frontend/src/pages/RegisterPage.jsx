import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { registerUser } from "../features/auth/authSlice";
import { useToast } from "../components/ui/Toast";

// Subject options per stream
const SUBJECTS_BY_STREAM = {
  "science-pcm": ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  "science-pcb": ["Physics", "Chemistry", "Biology", "Psychology"],
  commerce: ["Accountancy", "Economics", "Business Studies", "Mathematics"],
  arts: ["History", "Political Science", "Geography", "Sociology", "English"],
  engineering: ["Engineering Mathematics", "Data Structures", "DBMS", "OS", "Computer Networks"],
  medical: ["Anatomy", "Physiology", "Biochemistry", "Pharmacology"],
  law: ["Constitutional Law", "Criminal Law", "Civil Law", "Corporate Law"],
  other: ["General Science", "General Mathematics", "English", "Social Studies"],
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const { toast } = useToast();

  // Multi-step form: step 1 = basic info, step 2 = academic profile
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profile: {
      educationLevel: "class9-10",
      stream: "science-pcm",
      subjects: [],
      language: "hinglish",
    },
  });

  // Handle basic field changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle profile field changes
  const handleProfileChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
        // Reset subjects when stream changes
        ...(field === "stream" && { subjects: [] }),
      },
    }));
  };

  // Toggle subject selection
  const toggleSubject = (subject) => {
    setForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        subjects: prev.profile.subjects.includes(subject)
          ? prev.profile.subjects.filter((s) => s !== subject)
          : [...prev.profile.subjects, subject],
      },
    }));
  };

  const handleSubmit = async () => {
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast("Welcome to ExamMind! 🎉", "success");
      navigate("/dashboard");
    } else {
      toast(result.payload || "Registration failed", "error");
    }
  };

  const educationOptions = [
    { value: "class6-8", label: "Class 6 – 8" },
    { value: "class9-10", label: "Class 9 – 10" },
    { value: "class11-12", label: "Class 11 – 12" },
    { value: "college", label: "College / University" },
  ];

  const streamOptions = [
    { value: "science-pcm", label: "Science (PCM)" },
    { value: "science-pcb", label: "Science (PCB)" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts / Humanities" },
    { value: "engineering", label: "Engineering" },
    { value: "medical", label: "Medical" },
    { value: "law", label: "Law" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Join ExamMind</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Step {step} of 2 — {step === 1 ? "Basic Info" : "Your Academic Profile"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-8" style={{ backgroundColor: "var(--border)" }}>
          <motion.div
            className="h-1 rounded-full bg-indigo-500"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="card p-6">
          {/* ===== STEP 1: Basic Info ===== */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rahul Kumar"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 transition-colors"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 transition-colors"
                  style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 transition-colors pr-10"
                    style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!form.name || !form.email || !form.password) {
                    toast("Please fill all fields", "error");
                    return;
                  }
                  if (form.password.length < 6) {
                    toast("Password must be at least 6 characters", "error");
                    return;
                  }
                  setStep(2);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
              >
                Next: Set Your Profile <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* ===== STEP 2: Academic Profile ===== */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Education Level */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                  Your Class / Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {educationOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleProfileChange("educationLevel", value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        form.profile.educationLevel === value
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-indigo-500/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                  Stream / Field
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {streamOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleProfileChange("stream", value)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        form.profile.stream === value
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-indigo-500/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                  Your Subjects <span style={{ color: "var(--text-muted)" }}>(select all)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS_BY_STREAM[form.profile.stream]?.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        form.profile.subjects.includes(subject)
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-indigo-500/50"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                  Preferred Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "hinglish", label: "Hinglish 🇮🇳" },
                    { value: "english", label: "English 🇬🇧" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleProfileChange("language", value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        form.profile.language === value
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-1.5 px-4 py-3">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                >
                  {loading ? "Creating account..." : "Create My Account 🚀"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
