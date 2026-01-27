import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }) => {
  const { loader, isLoggedIn } = useAuth();
  if (loader) return <div>Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
