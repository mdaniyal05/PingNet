const express = require("express");
const router = express.Router();
const { uploadAvatar, profile } = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

router.post(
  "/user/upload-avatar",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  uploadAvatar
);
router.get("/user/profile", verifyJWT, profile);

module.exports = router;
