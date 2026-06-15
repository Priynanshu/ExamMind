import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, Flame, BookOpen, ArrowRight, Plus, Clock } from "lucide-react";
import { fetchSessions } from "../features/doubt/doubtSlice";
import { fetchProgress } from "../features/progress/progressSlice";
import { SessionCardSkeleton } from "../components/ui/Skeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sessions, loading: sessionsLoading } = useSelector((state) => state.doubt);
  const { overview, loading: progressLoading } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchSessions({ limit: 5 })); // Recent 5 sessions
    dispatch(fetchProgress());
  }, [dispatch]);

  // Label maps for display
  const levelLabel = {
    "class6-8": "Class 6-8", "class9-10": "Class 9-10",
    "class11-12": "Class 11-12", "college": "College",
  };

  const streamLabel = {
    "science-pcm": "Science PCM", "science-pcb": "Science PCB",
    commerce: "Commerce", arts: "Arts", engineering: "Engineering",
    medical: "Medical", law: "Law", other: "General",
  };

  const stats = [
    { icon: MessageSquare, label: "Total Doubts", value: overview?.totalDoubts ?? 0, color: "text-blue-400" },
    { icon: BookOpen, label: "Resolved", value: overview?.resolvedDoubts ?? 0, color: "text-green-400" },
    { icon: Flame, label: "Day Streak", value: overview?.streak?.current ?? 0, color: "text-orange-400" },
    { icon: TrendingUp, label: "Longest Streak", value: overview?.streak?.longest ?? 0, color: "text-purple-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-sm mt-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
          <span className="px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: "var(--border)" }}>
            {levelLabel[user?.profile?.educationLevel]}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: "var(--border)" }}>
            {streamLabel[user?.profile?.stream]}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: "var(--border)" }}>
            {user?.profile?.language === "hinglish" ? "🇮🇳 Hinglish" : "🇬🇧 English"}
          </span>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="card p-4"
          >
            <Icon size={20} className={`${color} mb-3`} />
            <div className="text-2xl font-bold">{progressLoading ? "—" : value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Sessions - takes 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Doubts</h2>
            <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {sessionsLoading ? (
              <>
                <SessionCardSkeleton />
                <SessionCardSkeleton />
                <SessionCardSkeleton />
              </>
            ) : sessions.length === 0 ? (
              <div className="card p-8 text-center">
                <MessageSquare size={32} className="mx-auto mb-3 text-indigo-400 opacity-50" />
                <p className="font-medium mb-1">No doubts yet!</p>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  Ask your first doubt and start truly understanding your subjects.
                </p>
                <Link to="/session" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2">
                  Ask First Doubt <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              sessions.map((session) => (
                <motion.div
                  key={session._id}
                  whileHover={{ x: 2 }}
                  className="card p-4 cursor-pointer"
                >
                  <Link to={`/session/${session._id}`} className="block">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{session.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                            {session.subject}
                          </span>
                          {session.isResolved && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                              ✓ Resolved
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                        <Clock size={11} />
                        {new Date(session.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Quick Actions */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/session" className="card p-4 flex items-center gap-3 hover:border-indigo-500/40 transition-all duration-200 block">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Plus size={20} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">New Doubt</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Start a new session</p>
                </div>
              </Link>

              <Link to="/progress" className="card p-4 flex items-center gap-3 hover:border-indigo-500/40 transition-all duration-200 block">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">My Progress</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>View stats & badges</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Subjects */}
          {user?.profile?.subjects?.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-3" style={{ color: "var(--text-muted)" }}>My Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {user.profile.subjects.map((subject) => (
                  <Link
                    key={subject}
                    to={`/session?subject=${subject}`}
                    className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-indigo-500/50 hover:text-indigo-400"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  >
                    {subject}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Streak motivator */}
          {overview?.streak?.current > 0 && (
            <div className="card p-4 border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={18} className="text-orange-400" />
                <span className="font-semibold text-sm">{overview.streak.current} Day Streak! 🔥</span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Keep it up! Come back tomorrow to maintain your streak.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
