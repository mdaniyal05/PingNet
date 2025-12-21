import { api } from "./api";

const API_URL: string = import.meta.env.VITE_API_URL;

let USER_URL: string;

if (import.meta.env.PROD) {
  USER_URL = `${API_URL}/api/v1/users`;
} else {
  USER_URL = "/api/v1/users";
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: () => ({
        url: `${USER_URL}/user/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const { useProfileQuery } = userApi;
