import { createSlice } from "@reduxjs/toolkit";

// Get saved theme or default to dark
const savedTheme = localStorage.getItem("examind-theme") || "dark";

// Apply theme class to html element immediately
document.documentElement.className = savedTheme;

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: savedTheme, // "dark" or "light"
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      // Apply to DOM
      document.documentElement.className = state.mode;
      // Save to localStorage
      localStorage.setItem("examind-theme", state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      document.documentElement.className = state.mode;
      localStorage.setItem("examind-theme", state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
