const roomForIndividualSelfUser = (socket) => {
  socket.join(socket.userId);
};

const roomForTwoUsersChatting = (socket) => {
  socket.on("join-room", (receiverId) => {
    const roomId = [socket.userId, receiverId].sort().join("-");

    socket.join(roomId);

    socket.to(receiverId).emit("user-online", {
      userId: socket.userId,
    });
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
