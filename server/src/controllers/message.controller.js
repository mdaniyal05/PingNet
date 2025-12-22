const Message = require("../models/message.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadFileOnCloudinary = require("../service/cloudinary");
const { newMessageEvent } = require("../webSockets/events/message.event");

const getMessages = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params._id;

  const messages = await Message.find({
    $or: [
      { senderId: senderId, receiverId: receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });

  if (!messages) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while fetching messages.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { messages }, "Your messages."));
});

const createMessage = asyncHandler(async (req, res) => {
  const { text, image, video } = req.body;

  const receiverId = req.params._id;
  const senderId = req.user._id;

  let imageLocalPath;
  let uploadedImage;
  let videoLocalPath;
  let uploadedVideo;

  if (
    image &&
    req.files &&
    Array.isArray(req.files.image) &&
    req.files.image.length > 0
  ) {
    imageLocalPath = req.files?.image[0]?.path;
    uploadedImage = await uploadFileOnCloudinary(imageLocalPath);
  }

  if (
    video &&
    req.files &&
    Array.isArray(req.files.video) &&
    req.files.video.length > 0
  ) {
    videoLocalPath = req.files?.video[0]?.path;
    uploadedVideo = await uploadFileOnCloudinary(videoLocalPath);
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    roomId,
    text,
    image: uploadedImage?.url,
    video: uploadedVideo?.url,
  });

  if (!newMessage) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while creating new message.");
  }

  const io = req.app.get("io");

  newMessageEvent(io, newMessage, senderId, receiverId);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { newMessage }, "New message created successfully.")
    );
});

module.exports = { getMessages, createMessage };
