import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function PrivateOutlet() {
  const auth = useAuth();
  const location = useLocation();

  return auth.user ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} />
  );
}
