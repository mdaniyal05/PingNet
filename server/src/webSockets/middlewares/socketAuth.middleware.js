const jwt = require("jsonwebtoken");
const asyncSocketHandler = require("../utils/asyncSocketHandler");
const ApiError = require("../../utils/apiError");
const User = require("../../models/user.model");

const socketAuth = asyncSocketHandler(async (socket, next) => {
  try {
    const jwtToken = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!jwtToken) {
      res.status(401);
      throw new ApiError(401, "Unauthorized request.");
    }

    const decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      res.status(401);
      throw new ApiError(401, "Invalid access token.");
    }

    const user = await User.findById(decoded?.payload.userId).select(
      "-password -refreshToken -avatar -dateOfBirth -about"
    );

    if (!user) {
      res.status(401);
      throw new ApiError(401, "Invalid access token.");
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    res.status(401);
    throw new ApiError(401, "Not authorized. Token failed.");
  }
});

module.exports = socketAuth;
