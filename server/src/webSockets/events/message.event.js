let receiverId;
let message;

const getMessage = (receiverId, message) => {
  receiverId = receiverId;
  message = message;
};

const sendMessage = (io, socket, onlineUsersMap) => {
  const receiverSocketId = onlineUsersMap.get(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("send:message", message);
  }
};

module.exports = {
  getMessage,
  sendMessage,
};
