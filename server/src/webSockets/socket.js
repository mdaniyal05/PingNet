const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth.middleware");
const { startTypingEvent, stopTypingEvent } = require("./events/typing.event");

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
    console.log(`User connected: ${socket.id}, UserId: ${socket.userId}`);

    activeUsers.set(socket.userId, socket.id);

    socket.join(socket.userId);

    socket.on("join-room", (receiverId) => {
      const roomId = [socket.userId, receiverId].sort().join("-");

      socket.join(roomId);

      console.log(`User ${socket.userId} joined room: ${roomId}`);

      socket.to(receiverId).emit("user-online", {
        userId: socket.userId,
      });
    });

    socket.on("send-message", (newMessage) => {
      console.log(newMessage);
    });

    socket.on("leave-room", (receiverId) => {
      const roomId = [socket.userId, receiverId].sort().join("-");

      socket.leave(roomId);

      console.log(`User ${socket.userId} left room: ${roomId}`);
    });

    startTypingEvent(socket);
    stopTypingEvent(socket);

    socket.on("message-read", ({ messageId, senderId }) => {
      socket.to(senderId).emit("message-read-receipt", {
        messageId,
        readBy: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}, UserId: ${socket.userId}`);
      activeUsers.delete(socket.userId);

      socket.broadcast.emit("user-offline", {
        userId: socket.userId,
      });
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
