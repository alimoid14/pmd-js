import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isCheckingAuth } = useAuthStore();
  if (isLoading || isCheckingAuth) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};