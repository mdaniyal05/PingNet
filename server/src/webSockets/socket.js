const { httpServer } = require("../app");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth.middleware");
const UserSocketMap = require("./userSocketMap");

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

const userStatusHandlers = require("./events/userStatus.event");

io.use(socketAuth);

const onlineUsersMap = new UserSocketMap();

const onConnection = (socket) => {
  userStatusHandlers(io, socket, onlineUsersMap);
};

io.on("connection", onConnection);

module.exports = io;
