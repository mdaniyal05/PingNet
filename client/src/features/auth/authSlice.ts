import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { AuthState, User } from "@/types/authTypes";

const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: null,
  isVerified: false,
  verifiedEmail: "",
};

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, { payload: user }: PayloadAction<User | null>) => {
      state.user = user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },
    setToken: (state, { payload: token }: PayloadAction<string | null>) => {
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
    },
    isEmailVerified: (
      state,
      {
        payload: { verified, email },
      }: PayloadAction<{ verified: boolean; email: string }>
    ) => {
      state.isVerified = verified;
      state.verifiedEmail = email;
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, setToken, logout, isEmailVerified } =
  slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
