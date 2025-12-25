const onOnlineEvent = (socket, activeUsers, io) => {
  socket.friends.forEach((friendId) => {
    const friendSockets = activeUsers.get(friendId);

    if (friendSockets) {
      friendSockets.forEach((socketId) => {
        io.to(socketId).emit("friend-online", {
          userId: socket.userId,
        });
      });
    }
  });
};

const onOfflineEvent = (socket, activeUsers, io) => {
  const isUserOffline = !activeUsers.has(socket.userId);

  if (isUserOffline) {
    socket.friends.forEach((friendId) => {
      const friendSockets = activeUsers.get(friendId);

      if (friendSockets) {
        friendSockets.forEach((socketId) => {
          io.to(socketId).emit("friend-offline", {
            userId: socket.userId,
          });
        });
      }
    });
  }
};

module.exports = { onOnlineEvent, onOfflineEvent };
