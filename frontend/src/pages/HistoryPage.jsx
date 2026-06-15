import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Clock, Search, Filter, CheckCircle, ArrowRight } from "lucide-react";
import { fetchSessions } from "../features/doubt/doubtSlice";
import { SessionCardSkeleton } from "../components/ui/Skeleton";

const SUBJECTS = ["All", "Physics", "Chemistry", "Mathematics", "Biology",
  "Computer Science", "Economics", "History", "English", "General"];

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { sessions, loading, pagination } = useSelector((state) => state.doubt);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (filterSubject !== "All") params.subject = filterSubject;
    dispatch(fetchSessions(params));
  }, [dispatch, page, filterSubject]);

  // Client-side search filter
  const filtered = sessions.filter((s) =>
    search ? s.title?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Doubt History</h1>
        <p style={{ color: "var(--text-muted)" }} className="text-sm">
          All your past doubt sessions — review, resume, or continue learning
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search your doubts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none focus:border-indigo-500 transition-colors"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text)" }}
          />
        </div>

        {/* Subject filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <select
            value={filterSubject}
            onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }}
            className="pl-8 pr-4 py-2.5 rounded-lg border text-sm outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text)" }}
          >
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Sessions list */}
      <div className="space-y-3">
        {loading ? (
          <>
            <SessionCardSkeleton />
            <SessionCardSkeleton />
            <SessionCardSkeleton />
            <SessionCardSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <MessageSquare size={36} className="mx-auto mb-3 text-indigo-400 opacity-40" />
            <p className="font-medium mb-2">No sessions found</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              {search || filterSubject !== "All"
                ? "Try different search or filter"
                : "Start asking doubts to build your history!"}
            </p>
            <Link to="/session" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2">
              Ask a Doubt <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          filtered.map((session, i) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 3 }}
            >
              <Link to={`/session/${session._id}`} className="card p-4 flex items-start justify-between gap-4 block hover:border-indigo-500/30 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare size={14} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{session.title || "Untitled Doubt"}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                          {session.subject}
                        </span>
                        {session.isResolved && (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle size={11} /> Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={11} />
                    {new Date(session.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </div>
                  <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
