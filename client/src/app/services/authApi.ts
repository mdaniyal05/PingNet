import { api } from "../services/api";
import type {
  UserResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/authTypes";

const API_URL: string = import.meta.env.VITE_API_URL;

let AUTH_URL: string;

if (import.meta.env.PROD) {
  AUTH_URL = `${API_URL}/api/v1/auth`;
} else {
  AUTH_URL = "/api/v1/auth";
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<UserResponse, RegisterRequest>({
      query: (payload) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: payload,
      }),
    }),
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (payload) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: payload,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload) => ({
        url: `${AUTH_URL}/verify-email`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useVerifyEmailMutation } =
  authApi;
