const formatDate = require("../../helper/formatDate");

const newMessageEvent = (io, newMessage, senderId, receiverId, roomId) => {
  io.to(roomId).emit("new-message", {
    senderId: senderId.toString(),
    receiverId: receiverId.toString(),
    text: newMessage.text,
    createdAt: formatDate(newMessage.createdAt),
  });
};

const sendMessageEvent = (socket) => {
  socket.on("send-message", (newMessage) => {
    console.log(newMessage);
  });
};

const readMessageEvent = (socket) => {
  socket.on("message-read", ({ messageId, senderId }) => {
    socket.to(senderId).emit("message-read-receipt", {
      messageId,
      readBy: socket.userId,
    });
  });
};

module.exports = { newMessageEvent, sendMessageEvent, readMessageEvent };
