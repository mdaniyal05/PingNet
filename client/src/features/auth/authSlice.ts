import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { AuthState } from "@/types/authTypes";

const initialState: AuthState = { user: null, token: null, isVerified: false };

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, token },
      }: PayloadAction<{ user: string; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    isEmailVerified: (state, { payload: verified }: PayloadAction<boolean>) => {
      state.isVerified = verified;
    },
  },
});

export const { setCredentials, logout, isEmailVerified } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
