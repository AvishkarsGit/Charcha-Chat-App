import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import Dashboard from "@/pages/Dashboard/Dashboard";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
]);
