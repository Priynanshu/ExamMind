import { ApiError } from "../utils/apiError.js";

// Global error handler - catches all errors passed via next(error)
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not our custom ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  // Send error response
  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export { errorHandler };
