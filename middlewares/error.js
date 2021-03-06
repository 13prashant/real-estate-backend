const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  // console.log(err);
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err, err.name, err.code);

  if (err.name === "CastError") {
    const message = `Resource is not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered!";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "server error",
  });
};

module.exports = errorHandler;
