import { useMemo } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { selectCurrentUser } from "../features/auth/authSlice";

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);

  return useMemo(() => ({ user }), [user]);
};
