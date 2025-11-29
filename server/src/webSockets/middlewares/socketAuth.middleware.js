const jwt = require("jsonwebtoken");
const asyncSocketHandler = require("../utils/asyncSocketHandler");
const User = require("../../models/user.model");

const socketAuth = asyncSocketHandler(async (socket, next) => {
  try {
    const jwtToken = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!jwtToken) {
      return next(new Error("Socket: Unauthorized request."));
    }

    const decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return next(new Error("Socket: Invalid access token."));
    }

    const user = await User.findById(decoded?.payload.userId).select(
      "-password -refreshToken -avatar -dateOfBirth -about"
    );

    if (!user) {
      return next(new Error("Socket: Invalid access token."));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    next();
  } catch (error) {
    next(new Error("Socket: Not authorized. Token failed."));
  }
});

module.exports = socketAuth;
