class ResponseHandler {
    static success(res, data, message = 'Success', statusCode = 200) {
      return res.status(statusCode).json({
        success: true,
        message,
        data
      });
    }
  
    static error(res, message = 'Error', statusCode = 500, errors = null) {
      return res.status(statusCode).json({
        success: false,
        message,
        errors
      });
    }
  
    static validationError(res, errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
  }
  
  module.exports = ResponseHandler;