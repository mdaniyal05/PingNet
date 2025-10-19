import VerifyEmail from "@/features/auth/VerifyEmail";

export default function VerifyEmailLayout() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyEmail />
      </div>
    </div>
  );
}
