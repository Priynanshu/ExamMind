import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createSession = createAsyncThunk("doubt/createSession", async (subject, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/doubt/session", { subject });
    return data.data.session;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create session");
  }
});

export const askDoubt = createAsyncThunk("doubt/ask", async ({ sessionId, message, image }, { rejectWithValue }) => {
  try {
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
});

export const fetchSessions = createAsyncThunk("doubt/fetchSessions", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/doubt/sessions", { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch sessions");
  }
});

export const fetchSession = createAsyncThunk("doubt/fetchSession", async (sessionId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/doubt/session/${sessionId}`);
    return data.data.session;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch session");
  }
});

export const resolveSession = createAsyncThunk("doubt/resolveSession", async (sessionId, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/doubt/session/${sessionId}/resolve`);
    return data.data.session;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to resolve session");
  }
});

export const deleteSession = createAsyncThunk("doubt/deleteSession", async (sessionId, { rejectWithValue }) => {
  try {
    await api.delete(`/doubt/session/${sessionId}`);
    return sessionId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete session");
  }
});

const doubtSlice = createSlice({
  name: "doubt",
  initialState: {
    sessions: [],
    currentSession: null,
    messages: [],
    loading: false,
    aiTyping: false,
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
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.currentSession = action.payload;
      state.messages = [];
    });

    builder
      .addCase(askDoubt.pending, (state, action) => {
        state.aiTyping = true;
        state.error = null;
        const { message } = action.meta.arg;
        if (message) state.messages.push({ role: "user", content: message, timestamp: new Date().toISOString() });
      })
      .addCase(askDoubt.fulfilled, (state, action) => {
        state.aiTyping = false;
        state.messages.push(action.payload.aiMessage);
        if (state.currentSession && action.payload.title) state.currentSession.title = action.payload.title;
      })
      .addCase(askDoubt.rejected, (state, action) => {
        state.aiTyping = false;
        state.error = action.payload;
        state.messages.pop();
      });

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

    builder.addCase(resolveSession.fulfilled, (state, action) => {
      const updated = action.payload;
      state.sessions = state.sessions.map((s) => s._id === updated._id ? { ...s, isResolved: true } : s);
      if (state.currentSession?._id === updated._id) state.currentSession = { ...state.currentSession, isResolved: true };
    });

    builder.addCase(deleteSession.fulfilled, (state, action) => {
      const deletedId = action.payload;
      state.sessions = state.sessions.filter((s) => s._id !== deletedId);
      if (state.currentSession?._id === deletedId) {
        state.currentSession = null;
        state.messages = [];
      }
    });
  },
});

export const { clearCurrentSession, clearError, setAiTyping } = doubtSlice.actions;
export default doubtSlice.reducer;
