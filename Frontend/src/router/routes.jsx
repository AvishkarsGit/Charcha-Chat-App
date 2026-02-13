import { createBrowserRouter } from "react-router";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Chat from "@/pages/Chat/ChatContainer/Chat";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import Groups from "@/pages/Groups/Groups";
import Meetings from "@/pages/Meetings/Meetings";
import LoadChats from "@/components/users/LoadChats";
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
        path: "/",
        element: <LoadChats />,
      },
      {
        path: "groups",
        element: <Groups />,
      },
      {
        path: "meetings",
        elements: <Meetings />,
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
