import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Create a new doubt session
export const createSession = createAsyncThunk(
  "doubt/createSession",
  async (subject, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/doubt/session", { subject });
      return data.data.session;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create session");
    }
  }
);

// Send a message and get AI response
export const askDoubt = createAsyncThunk(
  "doubt/ask",
  async ({ sessionId, message, image }, { rejectWithValue }) => {
    try {
      // Use FormData if there's an image file
      let payload;
      let headers = {};
      if (image) {
        payload = new FormData();
        payload.append("message", message);
        payload.append("image", image);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = { message };
      }

      const { data } = await api.post(`/doubt/ask/${sessionId}`, payload, { headers });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get response");
    }
  }
);

// Fetch all sessions
export const fetchSessions = createAsyncThunk(
  "doubt/fetchSessions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/doubt/sessions", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sessions");
    }
  }
);

// Fetch single session
export const fetchSession = createAsyncThunk(
  "doubt/fetchSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/doubt/session/${sessionId}`);
      return data.data.session;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch session");
    }
  }
);

const doubtSlice = createSlice({
  name: "doubt",
  initialState: {
    sessions: [],           // List of all sessions
    currentSession: null,   // Active chat session
    messages: [],           // Messages in current session
    loading: false,
    aiTyping: false,        // Show typing indicator when AI is responding
    error: null,
    pagination: null,
  },
  reducers: {
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setAiTyping: (state, action) => {
      state.aiTyping = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create session
    builder
      .addCase(createSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.messages = [];
      });

    // Ask doubt - show user message immediately, then AI response
    builder
      .addCase(askDoubt.pending, (state, action) => {
        state.aiTyping = true;
        state.error = null;
        // Optimistically add user's message to chat immediately
        const { message } = action.meta.arg;
        if (message) {
          state.messages.push({ role: "user", content: message, timestamp: new Date().toISOString() });
        }
      })
      .addCase(askDoubt.fulfilled, (state, action) => {
        state.aiTyping = false;
        // Add AI response
        state.messages.push(action.payload.aiMessage);
        // Update session title if it was generated
        if (state.currentSession && action.payload.title) {
          state.currentSession.title = action.payload.title;
        }
      })
      .addCase(askDoubt.rejected, (state, action) => {
        state.aiTyping = false;
        state.error = action.payload;
        // Remove the optimistically added user message on failure
        state.messages.pop();
      });

    // Fetch sessions list
    builder
      .addCase(fetchSessions.pending, (state) => { state.loading = true; })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.sessions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single session with messages
    builder
      .addCase(fetchSession.pending, (state) => { state.loading = true; })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.messages = action.payload.messages;
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSession, clearError, setAiTyping } = doubtSlice.actions;
export default doubtSlice.reducer;
