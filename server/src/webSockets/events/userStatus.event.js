module.exports = (io, socket, onlineUsersMap) => {
  const userId = socket.userId;

  const onlineUsers = () => {
    onlineUsersMap.set(userId, socket.id);

    return onlineUsersMap.getKeys();
  };

  const offlineUsers = () => {
    onlineUsersMap.delete(userId);

    return onlineUsersMap.getKeys();
  };

  io.emit("status:online", onlineUsers);
  socket.on("disconnect", offlineUsers);
};
