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

router.post("/friend/send-friend-request/:_id", verifyJWT, sendFriendRequest);
router.post(
  "/friend/accept-friend-request/:_id",
  verifyJWT,
  acceptFriendRequest
);
router.post(
  "/friend/reject-friend-request/:_id",
  verifyJWT,
  rejectFriendRequest
);
router.post("/friend/remove-friend", verifyJWT, removeFriend);
router.get("/friend/friend-list", verifyJWT, showFriendList);
router.get("/friend/friend-requests", verifyJWT, showFriendRequests);
router.get("/friend/search-friend", verifyJWT, searchFriendToAdd);

module.exports = router;
