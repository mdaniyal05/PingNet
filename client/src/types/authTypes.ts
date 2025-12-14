export type RegisterRequest = {
  username: string;
  fullname: string;
  email: string;
  about: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  username: string | null;
  email: string | null;
  password: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isVerified: boolean;
  verifiedEmail: string | "";
};
