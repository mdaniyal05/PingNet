const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const Redis = require("ioredis");

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

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
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
