const User = require("../models/user.model");
const Friend = require("../models/friend.model");
const Otp = require("../models/otp.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const generateJwtToken = require("../utils/generateJwtToken");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
};

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
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
    res.status(500);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token."
    );
  }
};

const userEmailVerification = asyncHandler(async (req, res) => {
  const emailVerification = req.emailVerfied;

  if (!emailVerification) {
    res.status(403);
    throw new ApiError(403, "Email is not verfied.");
  }

  await Otp.deleteOne({ email: emailVerification });

  req.emailVerfied = null;

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Your email is verified."));
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    fullname,
    about,
    dateOfBirth,
    email,
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
    res.status(400);
    throw new ApiError(400, "All fields are required.");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new ApiError(400, "Password and confirm password does not match.");
  }

  const isUserExists = await User.findOne({ username });

  if (isUserExists) {
    res.status(409);
    throw new ApiError(409, "User with this username already exists.");
  }

  const newUser = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    about,
    dateOfBirth,
    password,
  });

  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while registering new user.");
  }

  const friendsFeature = await Friend.create({
    currentUser: user._id,
  });

  if (!friendsFeature) {
    res.status(500);
    throw new ApiError(
      500,
      "Something went wrong while creating friends feature for the new registered user."
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    res.status(400);
    throw new ApiError(400, "Email or username is required.");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    res.status(404);
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    res.status(401);
    throw new ApiError(401, "Invalid password.");
  }

  const { refreshToken, accessToken } = await generateAccessandRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken: accessToken,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
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
    res.status(404);
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
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401);
    throw new ApiError(401, "Unauthorized request.");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded?.payload.userId);

  if (!user) {
    res.status(401);
    throw new ApiError(401, "Invalid refresh token.");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    res.status(401);
    throw new ApiError(401, "Refresh token is expired or used.");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

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
