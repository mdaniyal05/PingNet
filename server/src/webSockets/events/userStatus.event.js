const UserSocketMap = require("../userSocketMap");

module.exports = (io, socket) => {
  const onlineUsersMap = new UserSocketMap();

  const userId = socket.userId;
  onlineUsersMap.set(userId, socket.id);

  const onlineUsers = () => {
    return onlineUsersMap.getKeys();
  };

  const offlineUsers = () => {
    onlineUsersMap.delete(userId);

    return onlineUsersMap.getKeys();
  };

  io.emit("status:online", onlineUsers);
  io.emit("status:offline", offlineUsers);
};
