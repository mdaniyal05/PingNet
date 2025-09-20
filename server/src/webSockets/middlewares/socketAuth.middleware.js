const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

const socketAuth = asyncHandler(async (socket, next) => {
  try {
    const jwtToken = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!jwtToken) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      throw new ApiError(401, "Invalid access token.");
    }

    const user = await User.findById(decoded?.payload.userId).select(
      "-password -refreshToken -avatar -dateOfBirth -about"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized. Token failed.");
  }
});

module.exports = socketAuth;
