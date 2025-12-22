const startTypingEvent = (socket) => {
  socket.on("typing", (receiverId) => {
    socket.to(receiverId).emit("user-typing", {
      senderId: socket.userId,
      isTyping: true,
    });
  });
};

const stopTypingEvent = (socket) => {
  socket.on("stop-typing", (receiverId) => {
    socket.to(receiverId).emit("user-stopped-typing", {
      senderId: socket.userId,
      isTyping: false,
    });
  });
};

module.exports = { startTypingEvent, stopTypingEvent };
