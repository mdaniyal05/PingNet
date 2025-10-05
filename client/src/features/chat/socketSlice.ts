import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SocketState } from "@/types/socketTypes";

const initialState: SocketState = {
  onlineFriends: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    onlineFriendsList: (
      state,
      { payload: onlineFriends }: PayloadAction<string[]>
    ) => {
      state.onlineFriends = onlineFriends;
    },
  },
});

export const { onlineFriendsList } = socketSlice.actions;

export default socketSlice.reducer;
