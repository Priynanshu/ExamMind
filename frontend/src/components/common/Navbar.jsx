import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, BookOpen, BarChart2, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { toggleTheme } from "../../features/theme/themeSlice";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Nav links for logged-in users
  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: BookOpen },
    { to: "/session", label: "Ask Doubt", icon: MessageSquare },
    { to: "/progress", label: "Progress", icon: BarChart2 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--text)" }}>
            Exam<span className="text-indigo-500">Mind</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg transition-all hover:bg-[var(--bg-card)]"
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? (
              <Sun size={18} style={{ color: "var(--text-muted)" }} />
            ) : (
              <Moon size={18} style={{ color: "var(--text-muted)" }} />
            )}
          </button>

          {user ? (
            <>
              {/* User avatar */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ borderColor: "var(--border)" }}>
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {user.name?.split(" ")[0]}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-500/10 hover:text-red-400"
                style={{ color: "var(--text-muted)" }}
              >
                <LogOut size={15} />
                Logout
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-card)]"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t px-4 py-3 space-y-1"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(to) ? "bg-indigo-500 text-white" : "text-[var(--text-muted)]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
