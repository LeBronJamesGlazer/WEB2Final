const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode || 500;
  
    // Log error stack to console
    console.error(err.stack);

    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { errorHandler };
