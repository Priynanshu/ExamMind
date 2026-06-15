import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastProvider } from "./components/ui/Toast";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import SessionPage from "./pages/SessionPage";
import ProgressPage from "./pages/ProgressPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes - require login */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/session" element={
                <ProtectedRoute><SessionPage /></ProtectedRoute>
              } />
              <Route path="/session/:sessionId" element={
                <ProtectedRoute><SessionPage /></ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute><ProgressPage /></ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute><HistoryPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  );
};

export default App;
