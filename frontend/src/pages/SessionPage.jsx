import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Image, X, Plus, BookOpen, CheckCircle,
  ChevronDown, Paperclip, Lightbulb
} from "lucide-react";
import { createSession, askDoubt, fetchSession, clearCurrentSession } from "../features/doubt/doubtSlice";
import { useToast } from "../components/ui/Toast";
import { ChatSkeleton } from "../components/ui/Skeleton";
import ReactMarkdown from "react-markdown";

// Typing indicator - 3 bouncing dots shown while AI is responding
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex items-end gap-2 px-4 py-2"
  >
    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
      <Lightbulb size={14} className="text-indigo-400" />
    </div>
    <div className="card px-4 py-3 rounded-2xl rounded-bl-sm">
      <div className="typing-dots flex gap-1">
        <span />
        <span />
        <span />
      </div>
    </div>
  </motion.div>
);

// Single chat message bubble
const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-2 px-4 py-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
        ${isUser ? "bg-indigo-500 text-white" : "bg-indigo-500/20 text-indigo-400"}`}>
        {isUser ? "Y" : <Lightbulb size={14} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {/* Image if any */}
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Question"
            className="max-w-xs rounded-xl border mb-1"
            style={{ borderColor: "var(--border)" }}
          />
        )}

        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-indigo-500 text-white rounded-br-sm"
              : "card rounded-bl-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            // Render AI response as markdown for bold, bullets, etc.
            <div className="prose prose-sm max-w-none"
              style={{ color: "var(--text)" }}>
              <MarkdownMessage content={message.content} />
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs px-1" style={{ color: "var(--text-muted)" }}>
          {new Date(message.timestamp || Date.now()).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>
    </motion.div>
  );
};

// Simple markdown renderer without external dependency issues
const MarkdownMessage = ({ content }) => {
  // Process markdown-like formatting
  const processLine = (line, index) => {
    // Bold text
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

    if (line.startsWith("## ")) return <h3 key={index} className="font-bold text-base mt-3 mb-1">{line.slice(3)}</h3>;
    if (line.startsWith("# ")) return <h2 key={index} className="font-bold text-lg mt-3 mb-1">{line.slice(2)}</h2>;
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return <li key={index} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: line.slice(2) }} />;
    }
    if (/^\d+\. /.test(line)) {
      return <li key={index} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\. /, '') }} />;
    }
    if (line.trim() === "") return <br key={index} />;
    return <p key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />;
  };

  return <div>{content.split('\n').map(processLine)}</div>;
};

// Subject selector dropdown
const SUBJECTS = [
  "Physics", "Chemistry", "Mathematics", "Biology",
  "Computer Science", "Accountancy", "Economics",
  "History", "Geography", "English", "General"
];

const SessionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionId } = useParams(); // For resuming existing session
  const { toast } = useToast();

  const { currentSession, messages, aiTyping, loading } = useSelector((state) => state.doubt);
  const { user } = useSelector((state) => state.auth);

  const [input, setInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subject") || "General");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Load existing session if sessionId in URL
  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSession(sessionId));
      setSessionStarted(true);
    } else {
      dispatch(clearCurrentSession());
      setSessionStarted(false);
    }
  }, [sessionId, dispatch]);

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be less than 5MB", "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send message
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed && !imageFile) return;
    if (aiTyping) return;

    let session = currentSession;

    // Create session if this is the first message
    if (!session) {
      const result = await dispatch(createSession(selectedSubject));
      if (createSession.rejected.match(result)) {
        toast("Failed to start session. Please try again.", "error");
        return;
      }
      session = result.payload;
      setSessionStarted(true);
      // Update URL without page reload
      navigate(`/session/${session._id}`, { replace: true });
    }

    setInput("");
    const img = imageFile;
    removeImage();

    const result = await dispatch(askDoubt({
      sessionId: session._id,
      message: trimmed,
      image: img,
    }));

    if (askDoubt.rejected.match(result)) {
      toast(result.payload || "Failed to get AI response", "error");
    }

    inputRef.current?.focus();
  };

  // Send on Enter (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Lightbulb size={16} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-medium text-sm">
              {currentSession?.title || "New Doubt Session"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              ExamMind AI · Socratic Tutor
            </p>
          </div>
        </div>

        {/* Subject picker */}
        <div className="relative">
          <button
            onClick={() => setShowSubjectPicker(!showSubjectPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:border-indigo-500/50"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <BookOpen size={13} />
            {selectedSubject}
            <ChevronDown size={12} />
          </button>

          {showSubjectPicker && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-1 w-48 rounded-xl border shadow-xl z-20 py-1 overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => { setSelectedSubject(sub); setShowSubjectPicker(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-card-hover)]
                    ${selectedSubject === sub ? "text-indigo-400 font-medium" : ""}`}
                  style={{ color: selectedSubject === sub ? undefined : "var(--text)" }}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Welcome screen when no messages */}
        {messages.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <Lightbulb size={28} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">What's your doubt today?</h2>
            <p className="text-sm max-w-sm mb-6" style={{ color: "var(--text-muted)" }}>
              I won't just give you the answer — I'll help you{" "}
              <span className="text-indigo-400 font-medium">think it through yourself</span>.
              That's how real understanding happens.
            </p>

            {/* Suggested prompts */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {[
                "I don't understand Newton's 3rd Law",
                "Explain photosynthesis to me",
                "How does compound interest work?",
                "What is recursion in programming?",
                "Explain the French Revolution",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-2 rounded-xl border text-xs transition-all hover:border-indigo-500/50 hover:text-indigo-400"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading existing session */}
        {loading && (
          <>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
        </AnimatePresence>

        {/* AI typing indicator */}
        <AnimatePresence>
          {aiTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t px-4 py-3" style={{ borderColor: "var(--border)" }}>
        {/* Image preview */}
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 relative inline-block"
          >
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border object-cover"
              style={{ borderColor: "var(--border)" }} />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <X size={11} />
            </button>
          </motion.div>
        )}

        <div className="flex items-end gap-2">
          {/* Image upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border transition-all hover:border-indigo-500/50 flex-shrink-0"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            title="Upload question image"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type your ${selectedSubject} doubt here... (Enter to send)`}
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors focus:border-indigo-500"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text)",
              maxHeight: "120px",
            }}
            onInput={(e) => {
              // Auto-resize textarea
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={(!input.trim() && !imageFile) || aiTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2.5 rounded-xl flex-shrink-0 transition-all ${
              (input.trim() || imageFile) && !aiTyping
                ? "bg-indigo-500 text-white"
                : "bg-[var(--bg-card)] text-[var(--text-muted)]"
            }`}
          >
            <Send size={18} />
          </motion.button>
        </div>

        <p className="text-xs mt-2 text-center" style={{ color: "var(--text-muted)" }}>
          ExamMind guides you to think, not just copy answers ✨
        </p>
      </div>
    </div>
  );
};

export default SessionPage;
