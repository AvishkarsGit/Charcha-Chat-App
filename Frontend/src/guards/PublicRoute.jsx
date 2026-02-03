import { useAuth } from "@/context/auth/UseAuth";
import { Navigate } from "react-router";

export const PublicRoute = ({ children }) => {
  const { loader, isLoggedIn } = useAuth();
  if (loader) return <div>Loading...</div>;

  return !isLoggedIn ? children : <Navigate to="/" replace />;
};
