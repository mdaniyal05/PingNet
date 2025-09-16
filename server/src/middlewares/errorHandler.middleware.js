const ApiError = require("../utils/apiError");

const notFound = (req, res, next) => {
  const error = new ApiError(404, `${req.originalUrl} - Not found`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  throw new ApiError(statusCode, message);
};

module.exports = { notFound, errorHandler };
