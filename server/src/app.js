const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const {
  notFound,
  errorHandler,
} = require("./middlewares/errorHandler.middleware");

// Import routers
const authRouter = require("./routes/auth.route");

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

app.use(notFound);
app.use(errorHandler);

module.exports = app;
