import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type SocketState = {
  activeChat: boolean | null;
};

const initialState: SocketState = {
  activeChat: false,
};

const slice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setActiveChat: (
      state,
      { payload: isActive }: PayloadAction<boolean | null>
    ) => {
      state.activeChat = isActive;
    },
  },
});

export const { setActiveChat } = slice.actions;

export const currentActiveChat = (state: RootState) => state.socket.activeChat;

export default slice.reducer;
