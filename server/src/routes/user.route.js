const express = require("express");
const router = express.Router();
const { uploadAvatar } = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");

router.post(
  "/user/upload-avatar",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  uploadAvatar
);

module.exports = router;
