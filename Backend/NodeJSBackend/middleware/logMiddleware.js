const winston = require("winston");
const expressWinston = require("express-winston");
const path = require("path");

//const __dirname = dirname(import.meta);

const serverLog = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      filename: path.join(__dirname, "../", "logs", "server.log"),
    }),
  ],
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.align(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf((log) => {
      // nếu log là error hiển thị stack trace còn không hiển thị message của log
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  msg: "|{{res.statusCode}}|\t{{req.method}} \t|\t{{res.responseTime}}ms \t|{{req.url}}",
  expressFormat: false,
  colorize: false,
});

const errorLog = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: "error",
      filename: path.join(__dirname, "../", "logs", "error.log"),
    }),
  ],
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.align(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf((log) => {
      // nếu log là error hiển thị stack trace còn không hiển thị message của log
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    })
  ),
  msg: "|{{res.statusCode}}|\t{{req.method}} \t|\t0ms \t|{{req.url}} | {{err}}",
  expressFormat: false,
  colorize: false,
  dumpExceptions: true,
  showStack: true,
});

module.exports = { serverLog, errorLog };
