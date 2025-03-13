const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const JWT_SECRET = 'your_jwt_secret_key';

class AuthMiddleware {
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
  }

  verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Token verification error', error);
      res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  }
}

module.exports = new AuthMiddleware();