const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const jwtToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!jwtToken) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?.payload.userId).select(
      "-password -refreshToken -avatar -dateOfBirth -about"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized. Token failed.");
  }
});

module.exports = verifyJWT;
