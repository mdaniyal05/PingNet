const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, OTP } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new ApiError(400, "User already exists with this email.");
  }

  if (!OTP) {
    res.status(404);
    throw new ApiError(404, "OTP is required for verification.");
  }

  const userOTP = await Otp.findOne({ email });

  if (!userOTP) {
    res.status(500);
    throw new ApiError(500, "No OTP found for this email.");
  }

  if (userOTP.isBlocked) {
    const currentTime = new Date();
    if (currentTime < userOTP.blockUntil) {
      res.status(403);
      throw new Error("You are blocked. Try after some time.");
    } else {
      userOTP.isBlocked = false;
      userOTP.otpAttempts = 0;
    }
  }

  const otpCreatedTime = userOTP.updatedAt;
  const currentTime = new Date();

  if (currentTime - otpCreatedTime > 5 * 60 * 1000) {
    res.status(403);
    throw new Error("OTP expired.");
  }

  if (userOTP.otp !== OTP) {
    userOTP.otpAttempts++;

    if (userOTP.otpAttempts >= 5) {
      userOTP.isBlocked = true;
      let blockUntil = new Date();
      blockUntil.setHours(blockUntil.getHours() + 1);
      userOTP.blockUntil = blockUntil;
    }

    res.status(403);
    throw new ApiError(403, "Invalid OTP. Try again.");
  }

  req.emailVerfied = email;

  next();
});

module.exports = verifyOTP;
