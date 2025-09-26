import { Navigate, Outlet, useLocation } from "react-router";
import { useEmailVerification } from "../hooks/useEmailVerification";

export function VerifiedOutlet() {
  const verified = useEmailVerification();
  const location = useLocation();

  return verified.verifiedEmail ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/verify" state={{ from: location }} />
  );
}
