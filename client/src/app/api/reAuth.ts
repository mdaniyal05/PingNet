import { baseQuery } from "./api";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { setToken, logout } from "@/features/auth/authSlice";

const mutex = new Mutex();

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (!mutex.isLocked()) {
    const release = await mutex.acquire();

    try {
      if (
        result?.error &&
        (result?.error?.status === 401 || result?.error?.status === 403)
      ) {
        console.log("Sending refresh token...");

        const refreshResult = await baseQuery(
          { url: "/api/v1/auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        console.log(refreshResult);

        if (refreshResult?.data) {
          const token = (refreshResult.data as { accessToken: string })
            .accessToken;

          api.dispatch(setToken(token));

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      }
    } finally {
      release();
    }
  } else {
    await mutex.waitForUnlock();

    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
