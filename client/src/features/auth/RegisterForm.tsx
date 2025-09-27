import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../../app/services/authApi";
import type { RegisterRequest } from "@/types/authTypes";
import React, { useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { Link } from "react-router";
import { InputFile } from "@/components/InputFile";
import useUploadFile from "@/hooks/useUploadFIle";
import { Progress } from "@/components/ui/progress";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [isUserInfoSent, setisUserInfoSent] = useState<boolean>(false);

  const [formState, setFormState] = useState<RegisterRequest>({
    username: "",
    fullname: "",
    email: "",
    about: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { handleFileUpload, status, uploadProgress } = useUploadFile(
    file,
    formState.email
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDateChange = (value: Date | undefined) => {
    setDate(value);
  };

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const submitHandlerRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      event.preventDefault();
      await register({ ...formState, dateOfBirth: date }).unwrap();
      setisUserInfoSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandlerAvatar = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      event.preventDefault();
      await handleFileUpload();
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  return isUserInfoSent ? (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={submitHandlerAvatar}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Upload your avatar</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Upload your avatar below to proceed further
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <InputFile onChange={handleFileChange} />
        </div>
        {status === "uploading" && <Progress value={uploadProgress} />}
        {status !== "uploading" && (
          <Button type="submit" className="w-full">
            Upload
          </Button>
        )}
        {status === "success" && (
          <p className="text-sm text-green-800">File uploaded successfully!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-800">
            Upload failed. Please try again.
          </p>
        )}
      </div>
    </form>
  ) : (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={submitHandlerRegister}
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
          <DatePicker value={date} onChange={handleDateChange} />
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
            id="confirmPassword"
            name="confirmPassword"
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
