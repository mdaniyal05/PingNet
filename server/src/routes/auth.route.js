const express = require("express");
const router = express.Router();
const {
  registerUser,
  userEmailVerification,
  loginUser,
  logoutUser,
  deleteUserAccount,
  refreshToken,
} = require("../controllers/auth.controller");
const verifyOTP = require("../middlewares/verifyOtp.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

router.post("/verify-email", verifyOTP, userEmailVerification);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.delete("/delete-account", verifyJWT, deleteUserAccount);
router.post("/refresh-token", refreshToken);

module.exports = router;
