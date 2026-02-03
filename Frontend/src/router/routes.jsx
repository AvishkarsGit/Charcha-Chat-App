import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Chat from "@/pages/Chat/Chat";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { PublicRoute } from "@/guards/PublicRoute";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
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
