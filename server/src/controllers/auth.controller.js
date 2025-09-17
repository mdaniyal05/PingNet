const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadFileOnCloudinary = require("../service/cloudinary");
const generateJwtToken = require("../utils/generateJwtToken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
};

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const refreshToken = generateJwtToken(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRY
    );

    const accessToken = generateJwtToken(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY
    );

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token."
    );
  }
};

const userEmailVerification = asyncHandler(async (req, res) => {
  const emailVerification = req.emailVerfied;

  if (!emailVerification) {
    throw new ApiError(403, "Email is not verfied.");
  }

  await Otp.deleteOne(emailVerification);

  req.emailVerfied = null;

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Your email is verified."));
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    fullname,
    email,
    about,
    dateOfBirth,
    password,
    confirmPassword,
  } = req.body;

  if (
    [
      username,
      fullname,
      email,
      about,
      dateOfBirth,
      password,
      confirmPassword,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password does not match.");
  }

  const isUserExists = await User.findOne(username);

  if (isUserExists) {
    throw new ApiError(409, "User with this username already exists.");
  }

  let avatarLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files?.avatar[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }

  const newUser = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    about,
    dateOfBirth,
    avatar: avatar.url,
    password,
  });

  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering new user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "Email or username is required.");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password.");
  }

  const { accessToken, refreshToken } = generateAccessandRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken: accessToken, user: user },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.refreshToken = null;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await User.deleteOne(userId);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User account deleted successfully."));
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded?.payload.userId);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used.");
  }

  const { accessToken, refreshToken } = generateAccessandRefreshToken(user._id);

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken: accessToken },
        "Access token refreshed."
      )
    );
});

module.exports = {
  registerUser,
  userEmailVerification,
  loginUser,
  logoutUser,
  deleteUserAccount,
  refreshToken,
};
