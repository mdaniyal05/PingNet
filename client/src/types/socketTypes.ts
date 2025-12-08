import type { Socket } from "socket.io-client";

interface ServerToClientEvents {
  "new-message": ({ ...args }) => void;
}

interface ClientToServerEvents {
  "online-friend": (onlineStatus: boolean) => void;
  "offline-friend": (offlineStatus: boolean) => void;
}

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>;
