const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  deleteUserAccount,
  refreshToken,
} = require("../controllers/auth.controller");
const upload = require("../middlewares/multer.middleware");

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete-account", deleteUserAccount);
router.post("/refresh-token", refreshToken);

module.exports = router;
