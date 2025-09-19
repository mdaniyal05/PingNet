const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");

router.get("/:_id", verifyJWT, getMessages);
router.post("/send-message/:_id", verifyJWT, sendMessage);

module.exports = router;
