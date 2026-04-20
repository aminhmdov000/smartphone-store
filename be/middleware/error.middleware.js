// const logger = require('../utils/logger');
// exports.errorHandler = (err,req,res,next) => {
//   logger.error({
//     message: err.message,
//     stack: err.stack,
//     url: req.originalUrl,
//     method: req.method
//   });
//   res.status(err.status || 500).json({error: err.message})
// };
exports.errorHandler = (err, req, res, next) => {
    console.error("XƏTA BAŞ VERDİ:", err); 
    res.status(500).json({ success: false, message: err.message });
};

