import { useMemo } from "react";
import { useAppSelector } from "@/hooks/store";
import { selectCurrentUser } from "../features/auth/authSlice";

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);

  return useMemo(() => ({ user }), [user]);
};
