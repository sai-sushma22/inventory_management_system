const logger = require('../utils/logger');
const ResponseHandler = require('../utils/responseHandler');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    stack: err.stack
  });

  const statusCode = err.status || 500;
  ResponseHandler.error(
    res, 
    err.message || 'Internal Server Error', 
    statusCode
  );
};

module.exports = errorMiddleware;