const express = require("express");
const { createServer } = require("node:http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const { initializeSocket } = require("./webSockets/socket");
const {
  notFound,
  errorHandler,
} = require("./middlewares/errorHandler.middleware");

// Import routers
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const otpRouter = require("./routes/otp.route");
const friendRouter = require("./routes/friend.route");
const messageRouter = require("./routes/message.route");

const whiteList = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const io = initializeSocket(httpServer, {
  corsOrigin: "http://localhost:3000",
  redisHost: "localhost",
  redisPort: 6379,
  redisPassword: undefined,
  redisDb: 0,
});

app.set("io", io);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/friends", friendRouter);
app.use("/api/v1/messages", messageRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = { httpServer, app };
