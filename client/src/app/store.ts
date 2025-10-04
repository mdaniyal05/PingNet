import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "../features/auth/authSlice";
import socketReducer from "../features/chat/socketSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: import.meta.env.PROD ? true : false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
