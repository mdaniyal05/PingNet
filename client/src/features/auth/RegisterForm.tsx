import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../../app/services/authApi";
import type { RegisterRequest } from "@/types/authTypes";
import React, { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Link } from "react-router";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<RegisterRequest>({
    username: "",
    fullname: "",
    email: "",
    about: "",
    dateOfBirth: "",
    password: "",
  });

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const submitHandler = async () => {
    try {
      await register(formState).unwrap();
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={submitHandler}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to register your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="samurai9821"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Jin Sakai"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="s@example.com"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="about">About</Label>
          <Input
            id="about"
            name="about"
            type="text"
            placeholder="Busy"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <DatePicker />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Confirm Password</Label>
            <Link
              to="/auth/forget-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </div>
    </form>
  );
}
