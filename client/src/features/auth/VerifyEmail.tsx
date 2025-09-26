import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Otp from "@/components/Otp";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useSendOtpMutation } from "../../app/services/otpApi";
import { useVerifyEmailMutation } from "../../app/services/authApi";

export default function VerifyEmail({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState<string>("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const navigate = useNavigate();

  const [sendOtp, { isLoading: isLoadingOtp }] = useSendOtpMutation();
  const [verifyEmail, { isLoading: isLoadingEmail }] = useVerifyEmailMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const submitHandlerEmail = async () => {
    try {
      await sendOtp(email).unwrap();
      setIsEmailSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandlerOtp = async () => {
    try {
      await verifyEmail(email).unwrap();
      navigate("/auth/register");
    } catch (error) {
      console.error(error);
    }
  };

  return isEmailSent ? (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form className="p-6 md:p-8" onSubmit={submitHandlerOtp}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Email Verification</h1>
                <p className="text-muted-foreground text-balance">
                  Enter 6 digit code sent to your email
                </p>
              </div>
              <Otp />
              <Button type="submit" className="w-full">
                {isLoadingOtp ? "Loading..." : "Verify"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form className="p-6 md:p-8" onSubmit={submitHandlerEmail}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Register your account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email below to register your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={email}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isLoadingEmail ? "Loading..." : "Send Code"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
