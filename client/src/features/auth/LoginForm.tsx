import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "../../app/api/authApi";
import type { LoginRequest, User } from "@/types/authTypes";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setCredentials, setToken } from "../../features/auth/authSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { ModeToggle } from "@/components/ModeToggle";

type loginWithtype = "email" | "username";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginWith, setLoginWith] = useState<loginWithtype>("email");

  const [formState, setFormState] = useState<LoginRequest>({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (user) {
      navigate("/sidebar");
    }
  }, [navigate, user]);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const submitHandlerLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      event.preventDefault();

      const response = await login({ ...formState });

      console.log(response);

      let user: User;
      let token: string;

      if (response) {
        const data = response.data.data;

        user = {
          username: data.username,
          email: data.email,
          fullname: data.fullname,
        };

        token = response.data.data.accessToken;

        dispatch(setCredentials(user));
        dispatch(setToken(token));
      }

      navigate("/chat");
    } catch (error) {
      console.error(error);
    }
  };

  return loginWith === "email" ? (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ModeToggle />
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={submitHandlerLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your PingNet account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? "Loading..." : "Login"}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?
                <Link to="/auth/verify">
                  <Button variant="link" className="cursor-pointer">
                    Sign up
                  </Button>
                </Link>
              </div>
              <div className="text-center text-sm">
                Login with
                <Button
                  variant="link"
                  onClick={() => setLoginWith("username")}
                  className="cursor-pointer"
                >
                  username
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <ModeToggle />
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0">
          <form className="p-6 md:p-8" onSubmit={submitHandlerLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your PingNet account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="ryuu1050"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? "Loading..." : "Login"}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?
                <Link to="/auth/verify">
                  <Button variant="link" className="cursor-pointer">
                    Sign up
                  </Button>
                </Link>
              </div>
              <div className="text-center text-sm">
                Login with
                <Button
                  variant="link"
                  onClick={() => setLoginWith("email")}
                  className="cursor-pointer"
                >
                  email
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
