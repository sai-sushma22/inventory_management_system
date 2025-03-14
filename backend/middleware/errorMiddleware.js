const logger = require('../utils/logger');
const ResponseHandler = require('../utils/responseHandler');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  if (err.name === 'MulterError') {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return ResponseHandler.error(
          res, 
          'File too large. Maximum size is 5MB', 
          400
        );
      case 'LIMIT_FILE_COUNT':
        return ResponseHandler.error(
          res, 
          'Too many files uploaded', 
          400
        );
      case 'LIMIT_UNEXPECTED_FILE':
        return ResponseHandler.error(
          res, 
          'Unexpected file field', 
          400
        );
    }
  }

  if (err.name === 'ValidationError') {
    return ResponseHandler.error(
      res, 
      'Validation Error', 
      400,
      Object.values(err.errors).map(e => e.message)
    );
  }

  const statusCode = err.status || 500;
  ResponseHandler.error(
    res, 
    err.message || 'Internal Server Error', 
    statusCode
  );
};

module.exports = errorMiddleware;