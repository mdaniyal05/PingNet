export interface User {
  username: string;
  fullname: string;
  email: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  username: string | null;
  email: string | null;
  password: string;
}

export interface RegisterRequest {
  username: string;
  fullname: string;
  email: string;
  about: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: string | null;
  token: string | null;
  isVerified: boolean;
}
