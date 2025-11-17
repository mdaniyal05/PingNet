import type { SocketIO } from "@/types/socketTypes";
import { io } from "socket.io-client";

const URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:8080";

export const socket: SocketIO = io(URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});
