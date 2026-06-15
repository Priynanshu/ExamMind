import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import { Flame, Trophy, BookOpen, MessageSquare, Star, Target, Zap, Award } from "lucide-react";
import { fetchProgress } from "../features/progress/progressSlice";
import { ProgressSkeleton } from "../components/ui/Skeleton";

// Badge config - what each badge looks like
const BADGE_CONFIG = {
  first_doubt: { icon: MessageSquare, label: "First Doubt!", color: "text-blue-400", bg: "bg-blue-500/10", desc: "Asked your first doubt" },
  curious_mind: { icon: BookOpen, label: "Curious Mind", color: "text-green-400", bg: "bg-green-500/10", desc: "Asked 10 doubts" },
  knowledge_seeker: { icon: Star, label: "Knowledge Seeker", color: "text-yellow-400", bg: "bg-yellow-500/10", desc: "Asked 50 doubts" },
  streak_3: { icon: Flame, label: "3-Day Streak", color: "text-orange-400", bg: "bg-orange-500/10", desc: "Active 3 days in a row" },
  streak_7: { icon: Flame, label: "Week Warrior", color: "text-red-400", bg: "bg-red-500/10", desc: "7-day streak!" },
  streak_30: { icon: Trophy, label: "Month Master", color: "text-purple-400", bg: "bg-purple-500/10", desc: "30-day streak!" },
  problem_solver: { icon: Target, label: "Problem Solver", color: "text-indigo-400", bg: "bg-indigo-500/10", desc: "Resolved 5 doubts" },
};

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm shadow-lg">
        <p style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="font-semibold text-indigo-400">{payload[0].value} doubts</p>
      </div>
    );
  }
  return null;
};

const ProgressPage = () => {
  const dispatch = useDispatch();
  const { overview, subjectData, activityData, badges, loading } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  const statCards = [
    { icon: MessageSquare, label: "Total Doubts Asked", value: overview?.totalDoubts ?? 0, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: BookOpen, label: "Doubts Resolved", value: overview?.resolvedDoubts ?? 0, color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Flame, label: "Current Streak", value: `${overview?.streak?.current ?? 0} days`, color: "text-orange-400", bg: "bg-orange-500/10" },
    { icon: Trophy, label: "Longest Streak", value: `${overview?.streak?.longest ?? 0} days`, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold mb-1">My Progress</h1>
        <p style={{ color: "var(--text-muted)" }} className="text-sm">
          Track how much you've learned and grown
        </p>
      </motion.div>

      {/* Stats grid */}
      {loading ? (
        <div className="mb-8"><ProgressSkeleton /></div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="card p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Weekly activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <h2 className="font-semibold mb-1">This Week's Activity</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Doubts asked per day</p>

          {activityData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={activityData} barSize={28}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="doubts" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No activity yet this week</p>
            </div>
          )}
        </motion.div>

        {/* Subject breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <h2 className="font-semibold mb-1">Doubts by Subject</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Which subjects you explore most</p>

          {subjectData?.length > 0 ? (
            <div className="space-y-3">
              {[...subjectData]
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map(({ subject, count }) => {
                  const max = subjectData[0]?.count || 1;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={subject}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--text)" }}>{subject}</span>
                        <span style={{ color: "var(--text-muted)" }}>{count} doubt{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-1.5 rounded-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Ask doubts to see subject breakdown</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-1">
          <Award size={18} className="text-yellow-400" />
          <h2 className="font-semibold">Badges Earned</h2>
        </div>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Keep learning to unlock more!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(BADGE_CONFIG).map(([key, { icon: Icon, label, color, bg, desc }]) => {
            const earned = badges?.includes(key);
            return (
              <motion.div
                key={key}
                whileHover={earned ? { scale: 1.03 } : {}}
                className={`p-4 rounded-xl border text-center transition-all ${
                  earned
                    ? "border-indigo-500/30 bg-indigo-500/5"
                    : "opacity-40"
                }`}
                style={{ borderColor: earned ? undefined : "var(--border)" }}
              >
                <div className={`w-10 h-10 rounded-xl ${earned ? bg : "bg-[var(--bg-card-hover)]"} flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={20} className={earned ? color : "text-[var(--text-muted)]"} />
                </div>
                <p className="text-xs font-semibold mb-0.5">{label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                {earned && (
                  <div className="mt-2 text-xs text-indigo-400 font-medium">✓ Earned!</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
