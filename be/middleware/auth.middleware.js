// GET TOKEN FROM HEADER
//VERIFY USING TOKEN
//ATTACH USER TO REQUEST
//CALL NEXT () TO PROCEED TO THE NEXT MIDDLEWARE OR CONTROLLER
//IMPORT JSONWEBTOKEN LIBRARY TO VERIFY JWT TOKENS
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger').logger;

//PROTECT MIDDLEWARE FUNCTION
exports.protect = (req,res,next) => {
    //GET AUTHORIZATION HEADER
    const authHeader = req.headers.authorization;
    //CHECK IF AUTHORIZATION HEADER EXISTS AND STARTS WITH 'BEARER'
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unauthorized!'});
    }
    try {
        //EXTACT TOKEN FROM HEADER (REMOVE 'BEARER ' PREFIX)
        const token = authHeader.split(' ')[1];
        logger.info('Auth middleware: Token verification started');
        //VERIFY TOKEN USING JWT SECRET KEY
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('Auth middleware: Token verified successfully');
        //ATTACH USER INFO TO REQUEST OBJECT (DECODED TOKEN CONTAINS USER ID AND ROLE);
        req.user = decoded;
        //CONTINUE TO THE NEXT MIDDLEWARE OR CONTROLLER
        next();
    } catch (err) {
        logger.error(`JWT Error: ${err.message}`);
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(401).json({error: 'Invalid or expired token!'});
        }
        next(err);
    }
};
//ADMIN-ONLY MIDDLEWARE FUNCTION TO CHECK IF USER HAS ADMIN ROLE
exports.admin = (req,res,next) => { 
  try {
    if(!req.user) return res.status(401).json({error: 'Unauthorized!'})
    if(req.user.role !== 'admin') return res.status(403).json({error: 'Forbidden! Admin only!'});
    next();  
  } catch (error) {
    next(error);
  }
  
}

