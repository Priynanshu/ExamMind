import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

// Toast context
const ToastContext = createContext(null);

// Individual toast item
const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <AlertCircle size={18} className="text-indigo-400" />,
  };

  const borders = {
    success: "border-green-500/30",
    error: "border-red-500/30",
    info: "border-indigo-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm ${borders[toast.type] || borders.info}`}
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      {icons[toast.type] || icons.info}
      <p className="text-sm flex-1" style={{ color: "var(--text)" }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

// Toast provider wraps the whole app
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container - fixed to bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast anywhere
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
