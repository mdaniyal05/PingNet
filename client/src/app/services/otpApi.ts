import { api } from "../services/api";

const API_URL: string = import.meta.env.VITE_API_URL;

let OTP_URL: string;

if (import.meta.env.PROD) {
  OTP_URL = `${API_URL}/api/v1/auth`;
} else {
  OTP_URL = "/api/v1/auth";
}

export const otpApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (payload) => ({
        url: `${OTP_URL}/send-otp`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useSendOtpMutation } = otpApi;
