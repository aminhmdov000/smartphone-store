const winston = require('winston');
exports.logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'smartphone-store' },
  transports: [
    new winston.transports.File({ // save to log file
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
