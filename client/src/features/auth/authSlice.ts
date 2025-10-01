import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { AuthState, User } from "@/types/authTypes";

const initialState: AuthState = {
  user: null,
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
    },
    setToken: (state, { payload: token }: PayloadAction<string | null>) => {
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    isEmailVerified: (
      state,
      {
        payload: { verified, email },
      }: PayloadAction<{ verified: boolean; email: string }>
    ) => {
      state.isVerified = verified;
      state.verifiedEmail = email;
    },
  },
});

export const { setCredentials, setToken, logout, isEmailVerified } =
  slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
