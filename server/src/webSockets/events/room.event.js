const User = require("../../models/user.model");

const roomForIndividualSelfUser = (socket) => {
  socket.join(socket.userId);
};

const roomForTwoUsersChatting = (socket, io) => {
  socket.on("join-room", async (receiverId) => {
    try {
      const receiverData = await User.findById(receiverId).select(
        "username fullname avatar"
      );

      const roomId = [socket.userId, receiverId].sort().join("-");

      socket.join(roomId);

      io.to(roomId).emit("receiver-data", receiverData);
    } catch (error) {
      console.error(error);
    }
  });
};

const leaveRoom = (socket) => {
  socket.on("leave-room", (receiverId) => {
    const roomId = [socket.userId, receiverId].sort().join("-");

    socket.leave(roomId);
  });
};

module.exports = {
  roomForIndividualSelfUser,
  roomForTwoUsersChatting,
  leaveRoom,
};
