const { createLogger, format, transports } = require('winston');
const path = require('path');

// Đường dẫn log
const logPath = path.join(__dirname, 'logs', 'app.log');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // vẫn in ra console
    new transports.File({ filename: logPath }) // thêm ghi vào file
  ]
});

module.exports = logger;
