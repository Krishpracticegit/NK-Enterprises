// Middleware for handling 404 Non-Existent Routes
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware (wired as last middleware in app.js)
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const response = {
    message: err.message || 'Internal Server Error'
  };

  // Strictly exclude stack trace from production error responses
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
