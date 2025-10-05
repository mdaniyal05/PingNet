import { Socket } from "socket.io-client";

export type SocketState = {
  onlineFriends: string[];
};

export type MessagePayload = {
  receiverId: string;
  message: string;
};

export type ServerToClientEvents = {
  "send:message": (message: string) => void;
  "status:online": (onlineUsers: string[]) => void;
};

export type ClientToServerEvents = {
  "message:send": (data: MessagePayload) => void;
};

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>;
