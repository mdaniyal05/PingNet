const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth.middleware");
const { startTypingEvent, stopTypingEvent } = require("./events/typing.event");
const {
  roomForIndividualSelfUser,
  roomForTwoUsersChatting,
  leaveRoom,
} = require("./events/room.event");
const { onOnlineEvent, onOfflineEvent } = require("./events/online.event");

function initializeSocket(httpServer, options = {}) {
  const io = new Server(httpServer, {
    cors: {
      corsOrigin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: options.pingTimeout || 60000,
    pingInterval: options.pingInterval || 25000,
  });

  io.use(socketAuth);

  const activeUsers = new Map();

  io.on("connection", (socket) => {
    const onlineFriends = socket.friends.filter((friendId) =>
      activeUsers.has(friendId)
    );

    socket.emit("online-friends", onlineFriends);

    if (!activeUsers.has(socket.userId)) {
      activeUsers.set(socket.userId, new Set());
    }

    activeUsers.get(socket.userId).add(socket.id);

    onOnlineEvent(socket, activeUsers, io);

    roomForIndividualSelfUser(socket);
    roomForTwoUsersChatting(socket);
    leaveRoom(socket);
    startTypingEvent(socket);
    stopTypingEvent(socket);

    const sockets = activeUsers.get(socket.userId);

    socket.on("disconnect", () => {
      onOfflineEvent(socket, activeUsers, io);

      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          activeUsers.delete(socket.userId);
        }
      }
    });
  });

  const cleanup = async () => {
    await io.close();
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  return io;
}

module.exports = { initializeSocket };
