import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Wraps routes that require authentication
// If user is not logged in, redirect to /login
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
