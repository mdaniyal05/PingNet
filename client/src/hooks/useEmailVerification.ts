import { useMemo } from "react";
import { useAppSelector } from "@/hooks/useStore";

export const useEmailVerification = () => {
  const verifiedEmail = useAppSelector((state) => state.auth.isVerified);

  return useMemo(() => ({ verifiedEmail }), [verifiedEmail]);
};
