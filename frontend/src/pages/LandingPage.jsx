import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Brain, MessageSquare, TrendingUp, ArrowRight,
  CheckCircle, Zap, Target, Users, BookOpen, Star
} from "lucide-react";

// Animation variants for staggered children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const features = [
    {
      icon: Brain,
      title: "Socratic Method AI",
      desc: "AI doesn't just give answers — it asks guiding questions so YOU discover the solution. Real understanding, not just memorization.",
    },
    {
      icon: Target,
      title: "Personalized to You",
      desc: "Choose your class (6–12 or College), stream (PCM/PCB/Commerce/Arts), and language. AI tailors every response to your level.",
    },
    {
      icon: MessageSquare,
      title: "Chat-Style Learning",
      desc: "Ask doubts in a familiar WhatsApp-style chat. Upload images of textbook questions. Get guided step-by-step.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Growth",
      desc: "See your progress across subjects, maintain daily streaks, earn badges. Know exactly where you're improving.",
    },
    {
      icon: Zap,
      title: "India-Specific Context",
      desc: "Responses reference NCERT, JEE, NEET, board exams. Examples from Indian context you actually relate to.",
    },
    {
      icon: Users,
      title: "For All Students",
      desc: "Class 6 to College. Science, Commerce, Arts, Engineering, Medical, Law. One platform, every student.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Set Your Profile",
      desc: "Tell us your class, stream, and preferred language. ExamMind adapts to you instantly.",
    },
    {
      step: "02",
      title: "Ask Your Doubt",
      desc: "Type your doubt or upload a photo of the question. Any subject, anytime.",
    },
    {
      step: "03",
      title: "Get Guided, Not Answered",
      desc: "AI asks you guiding questions. You think, you discover, you understand. That's real learning.",
    },
  ];

  const testimonials = [
    { name: "Priya S.", class: "Class 12 PCB", text: "Physics used to be my nightmare. Now I actually understand why formulas work, not just how to use them!", stars: 5 },
    { name: "Rahul K.", class: "B.Tech CSE", text: "Finally an AI that doesn't just paste answers. ExamMind made me think through my Data Structures doubts.", stars: 5 },
    { name: "Ananya M.", class: "Class 10", text: "I solved an Algebra problem myself for the first time after ExamMind asked me the right questions. Best feeling!", stars: 5 },
  ];

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-8"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-card)" }}>
            <Zap size={14} className="text-indigo-400" />
            AI-Powered Socratic Tutoring for Indian Students
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item} className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
            Don&apos;t just get answers.{" "}
            <span className="gradient-text">Understand them.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={item} className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}>
            ExamMind is an AI tutor that guides you to discover answers yourself — using the same Socratic method the world's best teachers use. For Class 6 to College.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4 rounded-xl glow">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4 rounded-xl glow">
                  Start Learning Free <ArrowRight size={18} />
                </Link>
                <Link to="/login"
                  className="btn-ghost inline-flex items-center justify-center gap-2 text-base px-8 py-4 rounded-xl">
                  Already a student? Login
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { value: "6-12+", label: "Classes Covered" },
              { value: "10+", label: "Subjects" },
              { value: "100%", label: "Socratic Method" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How ExamMind Works</h2>
            <p style={{ color: "var(--text-muted)" }}>Three simple steps to start understanding, not just memorizing</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6 relative"
              >
                <div className="text-5xl font-black mb-4 opacity-10">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <BookOpen size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to truly learn</h2>
            <p style={{ color: "var(--text-muted)" }}>Built specifically for Indian students, with the way you actually learn</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Students who get it now</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, class: cls, text, stars }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(stars)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>"{text}"</p>
                <div>
                  <div className="font-medium text-sm">{name}</div>
                  <div className="text-xs text-indigo-400">{cls}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to actually <span className="gradient-text">understand</span> your syllabus?
          </h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Join thousands of students who stopped mugging and started understanding.
          </p>
          {user ? (
            <Link to="/dashboard"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl glow">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <Link to="/register"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl glow">
              Start for Free <ArrowRight size={18} />
            </Link>
          )}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm"
            style={{ color: "var(--text-muted)" }}>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> No credit card</div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> Free to use</div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /> All subjects</div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <p>© 2026 ExamMind. Built with Love for Indian students.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
