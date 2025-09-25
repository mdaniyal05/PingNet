import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (!token) return headers;

      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints: () => ({}),
});
