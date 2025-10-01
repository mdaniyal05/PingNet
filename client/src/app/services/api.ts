import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { baseQueryWithReauth } from "./reAuth";

export const baseQuery = fetchBaseQuery({
  baseUrl: "",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (!token) return headers;

    headers.set("Authorization", `Bearer ${token}`);
  },
});

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
