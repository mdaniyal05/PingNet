const express = require("express");
const { createServer } = require("node:http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const server = createServer(app);
const {
  notFound,
  errorHandler,
} = require("./middlewares/errorHandler.middleware");

// Import routers
const authRouter = require("./routes/auth.route");
const otpRouter = require("./routes/otp.route");
const friendRouter = require("./routes/friend.route");

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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/friends", friendRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = { server, app };
