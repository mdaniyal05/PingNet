const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const Redis = require("ioredis");
const socketAuth = require("./middlewares/socketAuth.middleware");

function initializeSocket(httpServer, options = {}) {
  const io = new Server(httpServer, {
    cors: {
      origin: options.corsOrigin || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },

    pingTimeout: options.pingTimeout || 60000,
    pingInterval: options.pingInterval || 25000,
  });

  const redisConfig = {
    host: options.redisHost || "localhost",
    port: options.redisPort || 6379,
    password: options.redisPassword || undefined,
    db: options.redisDb || 0,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  };

  const pubClient = new Redis(redisConfig);
  const subClient = pubClient.duplicate();

  io.use(socketAuth);

  pubClient.on("error", (err) => {
    console.error("Redis Pub Client Error:", err);
  });

  subClient.on("error", (err) => {
    console.error("Redis Sub Client Error:", err);
  });

  pubClient.on("connect", () => {
    console.log("Redis Publisher connected");
  });

  subClient.on("connect", () => {
    console.log("Redis Subscriber connected");
  });

  io.adapter(createAdapter(pubClient, subClient));

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
    })

    socket.on("leave-room", (receiverId) => {
      const roomId = [socket.userId, receiverId].sort().join("-");

      socket.leave(roomId);

      console.log(`User ${socket.userId} left room: ${roomId}`);
    });

    socket.on("typing", ({ receiverId }) => {
      socket.to(receiverId).emit("userTyping", {
        senderId: socket.userId,
      });
    });

    socket.on("stopTyping", ({ receiverId }) => {
      socket.to(receiverId).emit("userStoppedTyping", {
        senderId: socket.userId,
      });
    });

    socket.on("messageRead", ({ messageId, senderId }) => {
      socket.to(senderId).emit("messageReadReceipt", {
        messageId,
        readBy: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}, UserId: ${socket.userId}`);
      activeUsers.delete(socket.userId);

      socket.broadcast.emit("userOffline", {
        userId: socket.userId,
      });
    });
  });

  const cleanup = async () => {
    console.log("Closing Socket.IO connections...");
    await io.close();
    await pubClient.quit();
    await subClient.quit();
    console.log("Socket.IO and Redis connections closed");
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  return io;
}

module.exports = { initializeSocket };
