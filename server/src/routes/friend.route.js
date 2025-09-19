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
  searchFriendToAdd,
} = require("../controllers/friend.controller");

router.post("/send-friend-request/:_id", verifyJWT, sendFriendRequest);
router.post("/accept-friend-request/:_id", verifyJWT, acceptFriendRequest);
router.post("/reject-friend-request/:_id", verifyJWT, rejectFriendRequest);
router.post("/remove-friend", verifyJWT, removeFriend);
router.get("/friend-list", verifyJWT, showFriendList);
router.get("/friend-requests", verifyJWT, showFriendRequests);
router.get("/search-friend", verifyJWT, searchFriendToAdd);

module.exports = router;
