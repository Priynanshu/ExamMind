import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch progress data from backend
export const fetchProgress = createAsyncThunk(
  "progress/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/progress");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch progress");
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    overview: null,
    subjectData: [],
    activityData: [],
    badges: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload.overview;
        state.subjectData = action.payload.subjectData;
        state.activityData = action.payload.activityData;
        state.badges = action.payload.badges;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default progressSlice.reducer;
