const { httpServer } = require("../app");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth.middleware");

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

io.use(socketAuth);

const onConnection = (socket) => {};

io.on("connection", onConnection);

module.exports = io;
