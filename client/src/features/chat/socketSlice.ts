import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { socket } from "./socket";
import type { SocketIO, SocketState } from "@/types/socketTypes";

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket: (state) => {
      const socketIo = socket.connect() as SocketIO;
      Object.assign(state, { socket: socketIo });
    },
    disconnectSocket: (state) => {
      state.socket?.disconnect();
      Object.assign(state, { socket: null });
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;

export const selectSocket = (state: RootState) => state.socket.socket;

export default socketSlice.reducer;
