import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import doubtReducer from "../features/doubt/doubtSlice";
import progressReducer from "../features/progress/progressSlice";
import themeReducer from "../features/theme/themeSlice";

// Central Redux store - manages all global state
export const store = configureStore({
  reducer: {
    auth: authReducer,
    doubt: doubtReducer,
    progress: progressReducer,
    theme: themeReducer,
  },
});

export default store;
