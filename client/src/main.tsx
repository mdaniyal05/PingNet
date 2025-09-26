import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import LoginFormLayout from "@/layouts/LoginFormLayout.tsx";
import RegisterFormLayout from "@/layouts/RegisterFormLayout.tsx";
import HomePage from "@/pages/HomePage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";
import VerifyEmailLayout from "./layouts/VerifyEmailLayout.tsx";
import { VerifiedOutlet } from "./utils/verifiedOutlet.tsx";
import { PrivateOutlet } from "./utils/privateOutlet.tsx";

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
            element: <LoginFormLayout />,
          },
          {
            element: <VerifiedOutlet />,
            children: [
              {
                path: "register",
                element: <RegisterFormLayout />,
              },
            ],
          },
          {
            path: "verify",
            element: <VerifyEmailLayout />,
          },
        ],
      },
      {
        element: <PrivateOutlet />,
        children: [],
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
