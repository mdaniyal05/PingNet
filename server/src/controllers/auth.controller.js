const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadFileOnCloudinary = require("../service/cloudinary");

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, about, dateOfBirth, password } = req.body;

  if (
    [username, fullname, email, about, dateOfBirth, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const isUserExists = await User.findOne({ $or: [{ email }, { username }] });

  if (isUserExists) {
    throw new ApiError(409, "User with this email or username already exists.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

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
  res.status(200).json({
    message: "ok",
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUserAccount,
  refreshToken,
};
