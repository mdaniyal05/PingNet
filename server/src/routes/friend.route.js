const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/auth.middleware");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  showFriendList,
  showFriendRequests,
} = require("../controllers/friend.controller");

router.post("/send-friend-request", verifyJWT, sendFriendRequest);
router.post("/accept-friend-request", verifyJWT, acceptFriendRequest);
router.post("/reject-friend-request", verifyJWT, rejectFriendRequest);
router.post("/remove-friend", verifyJWT, removeFriend);
router.get("/friend-list", verifyJWT, showFriendList);
router.get("/friend-requests", verifyJWT, showFriendRequests);

module.exports = router;
