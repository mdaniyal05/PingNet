const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");
const upload = require("../middlewares/multer.middleware");

router.get("/:_id", verifyJWT, getMessages);
router.post(
  "/send-message/:_id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  verifyJWT,
  sendMessage
);

module.exports = router;
