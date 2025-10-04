import { io } from "socket.io-client";

const URL = import.meta.env.PROD ? undefined : "http://localhost:8080";

export const socket = io(URL);
