const Friend = require("../models/friend.model");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const sendFriendRequest = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params._id;

  if (String(senderId) === receiverId) {
    res.status(409);
    res.json(
      new ApiResponse(409, {}, "You can't send friend request to yourself.")
    );
  }

  const searchedUser = await Friend.findOne({ friendsList: receiverId });

  if (searchedUser) {
    res.status(409);
    res.json(new ApiResponse(409, {}, "This user is already your friend."));
  }

  const sendRequest = await Friend.findOneAndUpdate(
    { currentUser: receiverId },
    {
      $addToSet: { friendRequests: senderId },
    },
    { returnOriginal: false }
  );

  if (!sendRequest) {
    res.status(500);
    throw new ApiError(
      500,
      "Something went wrong while sending friend request."
    );
  }

  return res.status(200).json(new ApiResponse(200, {}, "Friend request sent."));
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const receiverId = req.user._id;
  const senderId = req.params._id;

  const acceptRequestSender = await Friend.findOneAndUpdate(
    { currentUser: senderId },
    {
      $addToSet: { friendsList: receiverId },
    }
  );

  const acceptRequestReceiver = await Friend.findOneAndUpdate(
    { currentUser: receiverId },
    {
      $addToSet: { friendsList: senderId },
      $pull: { friendRequests: senderId },
    }
  );

  if (!(acceptRequestReceiver && acceptRequestSender)) {
    res.status(500);
    throw new ApiError(
      500,
      "Something went wrong while accepting friend request."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request accepted."));
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const receiverId = req.user._id;
  const senderId = req.params._id;

  const rejectRequest = await Friend.findOneAndUpdate(
    { currentUser: receiverId },
    {
      $pull: { friendRequests: senderId },
    }
  );

  if (!rejectRequest) {
    res.status(500);
    throw new ApiError(
      500,
      "Something went wrong while rejecting friend request."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request rejected."));
});

const removeFriend = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const friendId = req.params._id;

  const currentUserRemoveFriend = await Friend.findOneAndUpdate(
    { currentUser: userId },
    { $pull: { friendsList: friendId } }
  );

  const removedFriend = await Friend.findOneAndUpdate(
    { currentUser: friendId },
    { $pull: { friendsList: userId } }
  );

  if (!removedFriend && !currentUserRemoveFriend) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while removing friend.");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Friend removed."));
});

const showFriendList = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const friendsList = await Friend.findOne({ currentUser: userId }).populate(
    "friendsList",
    "username fullname email avatar about"
  );

  if (!friendsList) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while fetching friend list.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { friendsList }, "Your friend list."));
});

const showFriendRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const friendRequests = await Friend.findOne({ currentUser: userId }).populate(
    "friendRequests",
    "username fullname email avatar about"
  );

  if (!friendRequests) {
    res.status(500);
    throw new ApiError(
      500,
      "Something went wrong while fetching friend requests."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { friendRequests }, "Your friend requests."));
});

const searchFriendToAdd = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username }).select(
    "-password -refreshToken"
  );

  if (!user) {
    res.status(404);
    throw new ApiError(404, "User with this username not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User with this username found."));
});

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  showFriendRequests,
  showFriendList,
  searchFriendToAdd,
};
