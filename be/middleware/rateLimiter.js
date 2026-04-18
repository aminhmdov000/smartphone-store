const rateLimit = require('express-rate-limit');
exports.limiter = rateLimit({
  windowMs: 15*60*1000, // 15 minutes
// max 100 requests in every 15 minutes
  message: {
    message: 'Too many requests, try again later'
  }
});

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    message: 'Too many login attempts!'
  }
});
