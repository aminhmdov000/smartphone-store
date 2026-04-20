const jwt = require('jsonwebtoken');
const logger = require('../utils/logger').logger;


exports.protect = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unauthorized!'});
    }
    try {
        const token = authHeader.split(' ')[1];
        logger.info('Auth middleware: Token verification started');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('Auth middleware: Token verified successfully');
        req.user = decoded;
        next();
    } catch (err) {
        logger.error(`JWT Error: ${err.message}`);
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(401).json({error: 'Invalid or expired token!'});
        }
        next(err);
    }
};
exports.admin = (req,res,next) => { 
  try {
    if(!req.user) return res.status(401).json({error: 'Unauthorized!'})
    if(req.user.role !== 'admin') return res.status(403).json({error: 'Forbidden! Admin only!'});
    next();  
  } catch (error) {
    next(error);
  }
  
}

