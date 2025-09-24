import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/redux/store.ts";
import LoginFormPage from "@/pages/LoginFormPage.tsx";
import RegisterFormPage from "@/pages/RegisterFormPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
        children: [
          {
            path: "login",
            element: <LoginFormPage />,
          },
          {
            path: "register",
            element: <RegisterFormPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />,
    </StrictMode>
  </Provider>
);
