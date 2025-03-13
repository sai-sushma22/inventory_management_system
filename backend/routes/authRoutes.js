const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/authMiddleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/profile', 
  AuthMiddleware.verifyToken, 
  (req, res) => {
    res.json({
      success: true,
      message: 'Access to protected route',
      user: req.user
    });
  }
);

module.exports = router;