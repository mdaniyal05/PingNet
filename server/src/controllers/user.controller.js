const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadFileOnCloudinary = require("../service/cloudinary");

const profile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userInfo = await User.findById(userId).select(
    "-password -refreshToken"
  );

  if (!userInfo) {
    res.status(404);
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userInfo, "User information."));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new ApiError(400, "Email is required.");
  }

  const user = await User.findOne({ email });

  let avatarLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files?.avatar[0]?.path;
  }

  if (!avatarLocalPath) {
    res.status(400);
    throw new ApiError(400, "Avatar file is required.");
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);

  if (!avatar) {
    res.status(400);
    throw new ApiError(400, "Avatar file is required.");
  }

  user.avatar = avatar.url;

  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { avatar: user.avatar },
        "Avatar uploaded successfully."
      )
    );
});

module.exports = { uploadAvatar, profile };
