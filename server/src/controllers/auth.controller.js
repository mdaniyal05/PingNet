const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.model");

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
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
