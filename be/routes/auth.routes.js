// IMPORT EXPRESS LIBRARY TO CREATE ROUTER
const express = require('express');
// CREATE A NEW ROUTER INSTANCE
const router = express.Router();
//  IMPORT THE CONTROLLER FUNCTIONS TO HANDLE AUTHENTICATION
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const limiter = require('../middleware/rateLimiter');
// DEFINE ROUTES FOR USER REGISTRATION AND LOGIN
router.post('/register', validate.validateReg, authController.register);
router.post('/login', validate.validateLogin,limiter.loginLimiter,authController.login); 
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
// EXPORT THE ROUTER TO BE USED IN APP.JS
module.exports = router;
