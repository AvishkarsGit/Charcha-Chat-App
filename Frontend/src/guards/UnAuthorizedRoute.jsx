import { Navigate } from "react-router";
import { useAuth } from "@/context/auth/UseAuth";

export const UnAuthorizedRoute = ({ children }) => {
  const { loading, isLoggedIn } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isLoggedIn ? <Navigate to="/" /> : children;
};
