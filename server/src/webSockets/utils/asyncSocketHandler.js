const asyncSocketHandler = (socketHandler) => {
  return async (socket, next) => {
    try {
      await socketHandler(socket, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncSocketHandler;
