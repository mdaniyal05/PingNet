const { httpServer } = require("../app");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth.middleware");

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

const onlineUsers = require("./events/userStatus.event");
const offlineUsers = require("./events/userStatus.event");

io.use(socketAuth);

const onConnection = (socket) => {
  onlineUsers(io, socket);

  socket.on("disconnect", offlineUsers);
};

io.on("connection", onConnection);

module.exports = io;
