import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isLoading, isCheckingAuth } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || isCheckingAuth) return null;

  return children;
};

export default RedirectAuthenticatedUser;