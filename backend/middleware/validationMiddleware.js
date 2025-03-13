const ResponseHandler = require('../utils/responseHandler');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => ({
        message: err.message,
        path: err.path
      }));    
      return ResponseHandler.validationError(res, errors);
    }
    next();
  };
};

module.exports = validateRequest;