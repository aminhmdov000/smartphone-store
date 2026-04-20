const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const limiter = require('../middleware/rateLimiter');

router.post('/register', validate.validateReg, authController.register);
router.post('/login', validate.validateLogin,limiter.loginLimiter,authController.login); 
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
