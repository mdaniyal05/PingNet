const Otp = require("../models/otp.model");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const generateOtp = require("../utils/otpGenerator");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const sendEmail = require("../utils/sendEmail");

const generateOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists with this email.");
  }

  if (!email) {
    throw new ApiError(400, "Email is required for verification.");
  }

  let OTP = await Otp.findOne({ email });

  if (!OTP) {
    OTP = await Otp.create({ email });
  }

  if (OTP.isBlocked) {
    const currentTime = new Date();

    if (currentTime < OTP.blockUntil) {
      throw new ApiError(403, "This email is blocked. Try after some time.");
    } else {
      OTP.isBlocked = false;
      OTP.otpAttempts = 0;
    }
  }

  const lastOtpTime = OTP.createdAt;
  const currentTime = new Date();

  if (
    OTP.otpAttempts !== 0 &&
    OTP.email === email &&
    lastOtpTime &&
    currentTime - lastOtpTime < 60000
  ) {
    throw new ApiError(403, "One minute gap is required between OTP requests.");
  }

  const newOTP = generateOtp();

  OTP.otp = newOTP;
  OTP.createdAt = new Date(currentTime);

  await OTP.save({ validateBeforeSave: false });

  await sendEmail(
    email,
    "Email Verification",
    OTP.otp,
    "../html",
    "otpTemplate.html"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP sent successfully. OTP will expire in 5 minutes and You have only 5 tries, after that, this email will be blocked for 1 hour."
      )
    );
});

module.exports = generateOTP;
