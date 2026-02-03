import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { routes } from "./router/routes.jsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ChatProvider } from "./context/chat/ChatProvider";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={routes} />
        <ToastContainer />
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
);
