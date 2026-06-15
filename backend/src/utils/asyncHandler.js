// Wraps async route handlers so we don't need try/catch in every controller
// Any thrown error is automatically passed to Express error handler
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { asyncHandler };
