import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { User, Save, BookOpen, Globe } from "lucide-react";
import { updateProfile } from "../features/auth/authSlice";
import { useToast } from "../components/ui/Toast";

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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    profile: {
      educationLevel: user?.profile?.educationLevel || "class9-10",
      stream: user?.profile?.stream || "science-pcm",
      subjects: user?.profile?.subjects || [],
      language: user?.profile?.language || "hinglish",
    },
  });

  const handleProfileChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
        ...(field === "stream" && { subjects: [] }),
      },
    }));
  };

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

  const handleSave = async () => {
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      toast("Profile updated! AI will now give better responses 🎯", "success");
    } else {
      toast("Update failed. Try again.", "error");
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">My Profile</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Keep your profile updated so AI gives you the most relevant responses
        </p>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 card p-4">
          <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
            <p className="text-xs mt-0.5 text-indigo-400">
              {user?.totalDoubts || 0} doubts asked · {user?.streak?.current || 0} day streak
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-indigo-400" />
              <h2 className="font-medium">Basic Info</h2>
            </div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 transition-colors"
              style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>

          {/* Education Level */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-indigo-400" />
              <h2 className="font-medium">Academic Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Education Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {educationOptions.map(({ value, label }) => (
                    <button key={value}
                      onClick={() => handleProfileChange("educationLevel", value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        form.profile.educationLevel === value
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-indigo-500/50"
                      }`}>{label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Stream / Field</label>
                <div className="grid grid-cols-2 gap-2">
                  {streamOptions.map(({ value, label }) => (
                    <button key={value}
                      onClick={() => handleProfileChange("stream", value)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        form.profile.stream === value
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-indigo-500/50"
                      }`}>{label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>My Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS_BY_STREAM[form.profile.stream]?.map((subject) => (
                    <button key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        form.profile.subjects.includes(subject)
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-indigo-500/50"
                      }`}>{subject}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} className="text-indigo-400" />
              <h2 className="font-medium">Language Preference</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: "hinglish", label: "Hinglish 🇮🇳" }, { value: "english", label: "English 🇬🇧" }].map(({ value, label }) => (
                <button key={value}
                  onClick={() => handleProfileChange("language", value)}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    form.profile.language === value
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : "border-[var(--border)] text-[var(--text-muted)]"
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
