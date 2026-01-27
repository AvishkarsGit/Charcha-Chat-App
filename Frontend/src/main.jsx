import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { routes } from "./router/routes.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={routes} />
      <ToastContainer/>
    </AuthProvider>
  </StrictMode>,
);
